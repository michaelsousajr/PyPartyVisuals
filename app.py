from flask import Flask, render_template, request, jsonify, url_for
import librosa
import os

app = Flask(__name__)


# Route to render the main page
@app.route("/")
def index():
    return render_template("index.html")


# Route to handle file upload and BPM calculation
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"})

    if file:
        filepath = os.path.join("uploads", file.filename)
        file.save(filepath)
        bpm = get_bpm(filepath)
        os.remove(filepath)  # Clean up the file after processing
        return jsonify({"bpm": bpm})


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == "static":
        filename = values.get("filename", None)
        if filename:
            file_path = os.path.join(app.root_path, endpoint, filename)
            values["q"] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


def get_bpm(filepath):
    y, sr = librosa.load(filepath)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    return tempo


if __name__ == "__main__":
    app.run(debug=True)
