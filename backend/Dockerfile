# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port your application listens on (if it's a web app)
# For example, if your Flask app runs on port 5000
# EXPOSE 5000

# Define environment variables (optional)
# ENV FLASK_APP=app.py

# Run the application
# For a simple script:
CMD ["python", "your_script_name.py"]
# For a web application using Gunicorn (example):
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]