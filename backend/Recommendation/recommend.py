from flask import Flask, jsonify, request
from pymongo import MongoClient
from collections import Counter
import numpy as np
from dotenv import load_dotenv
from bson import ObjectId
import os

# Load environment variables from .env file
load_dotenv()


app = Flask(__name__)

# MongoDB connection setup
DATABASE_URI = os.getenv("MONGO_URI")
client = MongoClient(DATABASE_URI)
db = client["Sem-6_Project"]  # Use your MongoDB database name
users_collection = db["users"]
movies_collection = db["movies"]

def get_user_data(user_id):
    """Fetch user data (liked movies, viewed movies, etc.) from MongoDB."""
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)

    user = users_collection.find_one({"_id": user_id})
    print("user", user)
    return user

def get_movie_by_id(movie_id):
    """Fetch movie data by ID."""
    movie = movies_collection.find_one({"_id": movie_id})
    return movie

def get_movie_category(movie_id):
    """Fetch movie category (genre) based on its ID."""
    movie = get_movie_by_id(movie_id)
    return movie['category'] if movie else None

def calculate_similarity(movie1_id, movie2_id):
    """Calculate similarity between two movies based on their categories/genres."""
    genre1 = get_movie_category(movie1_id)
    genre2 = get_movie_category(movie2_id)
    
    # Simple similarity measure: 1 if genres match, else 0
    if genre1 == genre2:
        return 1
    return 0

def get_similar_movies(user_id):
    """Get similar movies for a user based on their viewed or liked movies."""
    user = get_user_data(user_id)
    viewed_movies = user.get('viewMovies', [])
    liked_movies = user.get('likedMovies', [])

    all_similar_movies = {}

    # Combine liked and viewed movies
    user_movies = viewed_movies + liked_movies

    # Iterate through each movie in the user's history
    for movie_data in user_movies:
        # Ensure we are getting the movie object from the database
        # If movie_data is just an ObjectId, get the actual movie document
        if isinstance(movie_data, ObjectId):
            movie_id = movie_data  # In case it's just the ObjectId
        else:
            movie_id = movie_data.get("movieId")  # If it's a dictionary with "movieId"

        # Compare with all other movies in the database
        for movie in movies_collection.find():
            other_movie_id = movie["_id"]

            if other_movie_id == movie_id:
                continue  # Skip the same movie

            similarity = calculate_similarity(movie_id, other_movie_id)

            if similarity == 1:  # If similar (same genre), consider adding it
                if other_movie_id not in all_similar_movies:
                    all_similar_movies[other_movie_id] = 0
                all_similar_movies[other_movie_id] += 1

    # Sort the similar movies by count (how many times they matched genres)
    sorted_similar_movies = sorted(all_similar_movies.items(), key=lambda x: x[1], reverse=True)
    return sorted_similar_movies

@app.route("/get_similar_movies/<user_id>", methods=["GET"])
def similar_movies(user_id):
    """API endpoint to get similar movies for a user."""
    similar_movies = get_similar_movies(user_id)
    result = []

    # Get movie details for the similar movies
    for movie_id, _ in similar_movies:
        movie = get_movie_by_id(movie_id)
        if movie:
            result.append({
                "movieId": str(movie["_id"]),  # Convert ObjectId to string
                "movieName": movie["name"],
                "category": movie["category"]
            })
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)