import http.server
import socketserver
import mimetypes
import gzip
import os

mimetypes.add_type('image/vnd.radiance', '.hdr')
mimetypes.add_type('application/wasm', '.wasm')
mimetypes.add_type('application/octet-stream', '.bin')

class OptimizedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='d:\\Stu\\HTML\\leapmotorC16', **kwargs)

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            if self.path.endswith(('.js', '.css', '.html', '.svg')):
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                        compressed = gzip.compress(content)
                        self.send_response(200)
                        self.send_header('Content-Type', self.guess_type(path))
                        self.send_header('Content-Encoding', 'gzip')
                        self.send_header('Content-Length', len(compressed))
                        self.send_header('Cache-Control', 'max-age=86400')
                        self.end_headers()
                        return self.wfile.write(compressed)
                except Exception:
                    pass
        return super().send_head()

    def log_message(self, format, *args):
        pass

PORT = 8000

print(f"Server running at http://localhost:{PORT}")
print("Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), OptimizedHTTPRequestHandler) as httpd:
    httpd.serve_forever()