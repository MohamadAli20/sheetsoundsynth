from flask import Flask, request, jsonify
from music21 import converter

app = Flask(__name__)

@app.route('/flask_server/convert-to-midi', methods=['POST'])
def convert_to_midi():
    # Get image data from the request
    request_data = request.get_json()
    base64_image_data = request_data['imageData']

    # Decode base64 image data and convert it to bytes
    image_data = base64_image_data.encode('utf-8')

    # Perform MIDI conversion using Music21
    score = converter.parseData(image_data)
    midi_data = score.write('midi')

    # Return MIDI data to the client
    return jsonify({'midiData': midi_data})

if __name__ == '__main__':
    app.run(debug=True)
