from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from collections import defaultdict
import datetime
import schedule
import time
import smtplib
from email.mime.text import MIMEText

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB connection setup
DATABASE_URI = os.getenv("MONGO_URI")
client = MongoClient(DATABASE_URI)
db = client["Sem-6_Project"]
users_collection = db["users"]
movies_collection = db["movies"]
view_movies_collection = db["viewMovies"]

# Function to fetch user's view history and calculate average watch time
# Function to fetch user's view history and calculate average watch time
def get_average_watch_time(user_id):
    user_movies = list(view_movies_collection.find({"userId": user_id}))
    
    if not user_movies:
        return None
    
    # Convert watchDuration from milliseconds to seconds before averaging
    total_watch_time = sum(movie['watchDuration'] // 1000 for movie in user_movies)
    average_watch_time = total_watch_time // len(user_movies)
    
    # Convert Unix timestamp (seconds) to HH:MM format
    watch_time = datetime.datetime.fromtimestamp(average_watch_time).strftime("%H:%M")
    
    return watch_time

# Function to recommend movies based on watch duration and genre
def get_movie_recommendations(user_id):
    user_movies = list(view_movies_collection.find({"userId": user_id}))
    if not user_movies:
        return []
    
    watched_movie_ids = {movie['movieId'] for movie in user_movies}
    watched_genres = {movie['category'] for movie in user_movies}
    
    recommended_movies = []
    
    for movie in movies_collection.find():
        if movie["_id"] not in watched_movie_ids and movie["category"] in watched_genres:
            recommended_movies.append({
                "movieId": str(movie["_id"]),
                "movieName": movie["name"],
                "category": movie["category"]
            })
    
    return recommended_movies[:5]  # Return top 5 recommendations

# Function to send email recommendations
def send_email(user_email, recommendations):
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password = os.getenv("EMAIL_PASSWORD")
    print(send_email, sender_password)
    
    if not recommendations:
        return
    
    movie_list = "\n".join([f"{movie['movieName']} ({movie['category']})" for movie in recommendations])
    
    message = MIMEText(f"Here are your movie recommendations:\n\n{movie_list}")
    message["Subject"] = "Your Daily Movie Recommendations"
    message["From"] = sender_email
    message["To"] = user_email
    
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, user_email, message.as_string())

# Function to schedule email at user's average watch time
def schedule_email(user_id, user_email):
    watch_time = get_average_watch_time(user_id)
    if not watch_time:
        print(f"No valid watch time found for user {user_id}. Skipping email scheduling.")
        return
    
    recommended_movies = get_movie_recommendations(user_id)
    
    print(f"Scheduling email for user {user_id} at {watch_time}")
    schedule.every().day.at(watch_time).do(send_email, user_email, recommended_movies)

# API to get recommended movies for a user
@app.route("/get_recommended_movies/<user_id>", methods=["GET"])
def recommended_movies(user_id):
    recommendations = get_movie_recommendations(user_id)
    return jsonify(recommendations)

# API to schedule daily email recommendations
@app.route("/schedule_email/<user_id>", methods=["POST"])
def schedule_recommendation_email(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or "email" not in user:
        return jsonify({"error": "User not found or email not available."}), 400
    
    schedule_email(user_id, user["email"])
    return jsonify({"message": "Email scheduled successfully."})

if __name__ == "__main__":
    app.run(debug=True, port=5003)
