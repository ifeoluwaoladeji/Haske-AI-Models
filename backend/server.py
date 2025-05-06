from flask import Flask, request, jsonify
import docker
import base64
import os

app = Flask(__name__)
client = docker.from_env()

@app.route('/process', methods=['POST'])
def process():
    try:
        model_id = request.form['model']
        file = request.files['file']
        
        # Model configuration
        models = {
            'unet_t1c': {
                'image': 'mailabhaske/glioma_unet:latest',
                'command': '--input /app/input/{filename} --output_dir /app/output'
            },
            'deepmedic': {
                'image': 'mailabhaske/deepmedic:latest',
                'command': '--study /app/input/{filename} --output /app/output'
            }
        }
        
        # Define output directory
        output_dir = '/path/to/output'

        # Run container
        container = client.containers.run(
            models[model_id]['image'],
            volumes={
                os.path.dirname(file.filename): {'bind': '/app/input', 'mode': 'ro'},
                output_dir: {'bind': '/app/output', 'mode': 'rw'}
            },
            command=models[model_id]['command'].format(filename=file.filename),
            detach=True
        )
        
        # ... processing logic ...
        output_file_path = os.path.join(output_dir, 'output_image.png')  # Replace with actual output file name
        with open(output_file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
        
        return jsonify({
            "image": base64_image,
            "metrics": {
                "volume": "14.7 cm³",
                "confidence": "92%"
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500