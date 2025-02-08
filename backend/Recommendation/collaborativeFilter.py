from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from flask_cors import CORS
from collections import defaultdict, Counter

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
DATABASE_URI = os.getenv("MONGO_URI")
client = MongoClient(DATABASE_URI)
db = client["Sem-6_Project"]
users_collection = db["users"]
movies_collection = db["movies"]

def get_user_data(user_id):
    """Fetch user data (liked movies) from MongoDB."""
    if isinstance(user_id, str):
        user_id = ObjectId(user_id)
    return users_collection.find_one({"_id": user_id})

def get_movie_by_id(movie_id):
    """Fetch movie data by ID."""
    return movies_collection.find_one({"_id": movie_id})

def find_similar_users(user_id):
    """Find users with similar movie preferences."""
    target_user = get_user_data(user_id)
    if not target_user:
        return []

    target_liked_movies = set(target_user.get("likedMovies", []))
    
    user_similarity = defaultdict(int)

    for user in users_collection.find():
        if user["_id"] == ObjectId(user_id):
            continue  # Skip the target user

        liked_movies = set(user.get("likedMovies", []))
        common_movies = target_liked_movies.intersection(liked_movies)

        if common_movies:
            user_similarity[user["_id"]] = len(common_movies)

    # Sort by similarity score (descending)
    sorted_users = sorted(user_similarity.items(), key=lambda x: x[1], reverse=True)
    return [user_id for user_id, _ in sorted_users]

def get_popular_movies(limit=10):
    """Get the most liked movies (fallback for new users)."""
    movie_counter = Counter()

    for user in users_collection.find():
        for movie_id in user.get("likedMovies", []):
            movie_counter[movie_id] += 1  # Count how many users liked each movie

    most_liked_movies = movie_counter.most_common(limit)  # Get top N movies

    # Fetch movie details
    popular_movies = []
    for movie_id, _ in most_liked_movies:
        movie = get_movie_by_id(movie_id)
        if movie:
            popular_movies.append({
                "movieId": str(movie["_id"]),
                "movieName": movie["name"],
                "category": movie["category"]
            })

    return popular_movies

def get_recommended_movies(user_id):
    """Recommend movies based on similar users' preferences or popular movies for new users."""
    similar_users = find_similar_users(user_id)
    target_user = get_user_data(user_id)

    if not target_user:
        return {"error": "User not found."}

    target_liked_movies = set(target_user.get("likedMovies", []))

    if not target_liked_movies:
        # If user has no liked movies, recommend popular movies
        return get_popular_movies()

    recommended_movies = set()

    for similar_user_id in similar_users:
        similar_user = get_user_data(similar_user_id)
        if not similar_user:
            continue

        for movie_id in similar_user.get("likedMovies", []):
            if movie_id not in target_liked_movies:
                recommended_movies.add(movie_id)

    # Fetch movie details
    result = []
    for movie_id in recommended_movies:
        movie = get_movie_by_id(movie_id)
        if movie:
            result.append({
                "movieId": str(movie["_id"]),
                "movieName": movie["name"],
                "category": movie["category"]
            })

    return result if result else get_popular_movies()

@app.route("/get_recommended_movies/<user_id>", methods=["GET"])
def recommended_movies(user_id):
    """API endpoint to get recommended movies for a user."""
    recommendations = get_recommended_movies(user_id)
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True, port=5002)
