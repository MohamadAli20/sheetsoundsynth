from flask import Flask, request, jsonify, Response
import cv2
import numpy as np
from datetime import datetime
from music21 import *
import os
import time
import subprocess
import onnxruntime as ort
print(ort.get_available_providers())


app = Flask(__name__)

# Define the folder path where you want to save the MIDI files
musicXml_folder = "oemer_output"

# Create the output folder if it doesn't exist
if not os.path.exists(musicXml_folder):
    os.makedirs(musicXml_folder)

# Define the folder path where you want to save the MIDI files
midi_folder = "midi"

# Create the output folder if it doesn't exist
if not os.path.exists(midi_folder):
    os.makedirs(midi_folder)

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        start_time = time.time()

        # Get the image path from the request body
        data = request.json
        image_path = "../" + data.get('imagePath')
        
        # Convert Image into MusicXML using Oemer
        # Run the oemer command to convert the image to MusicXML
        command = ['oemer', image_path, '-o', './' + musicXml_folder]

        try:
            subprocess.run(command, check=True)
            end_time = time.time()
            print("Time taken:" + str(end_time - start_time))
        except subprocess.CalledProcessError:
            return jsonify({'error': 'Conversion failed'}), 500
        
        # convert MusicXML into MIDI using Music21
        xml_path = musicXml_folder + "/" + os.path.splitext(data.get('imagePath'))[0] + ".musicxml"
        xml_path = xml_path.replace('/uploads', '')
        # Convert MusicXML to MIDI
        score = converter.parse(xml_path)
        
        # Define the output MIDI file path
        midi_filename = os.path.splitext(os.path.basename(xml_path))[0] + ".mid"
        midi_path = os.path.join(midi_folder, midi_filename)

        score.write('midi', midi_path)
        
        return "/midi/"+midi_filename
    except Exception as e:
        print('Error processing image:', e)
        return 'Error processing image', 500

if __name__ == '__main__':
    app.run(debug=True)
