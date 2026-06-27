class StreamPlayer {
    constructor() {
        this.video = document.getElementById('videoPlayer');
        this.streamUrlInput = document.getElementById('streamUrl');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.statusText = document.getElementById('statusText');
        this.urlText = document.getElementById('urlText');
        this.bitrateText = document.getElementById('bitrateText');
        
        this.hls = null;
        this.currentUrl = null;
        this.isPlaying = false;

        this.initializeEventListeners();
        this.checkHLSSupport();
    }

    initializeEventListeners() {
        this.playBtn.addEventListener('click', () => this.playStream());
        this.stopBtn.addEventListener('click', () => this.stopStream());
        this.streamUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.playStream();
        });

        // Preset buttons
        document.querySelectorAll('.btn-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                if (url) {
                    this.streamUrlInput.value = url;
                    this.playStream();
                } else {
                    this.streamUrlInput.focus();
                }
            });
        });

        // Video events
        this.video.addEventListener('play', () => this.onVideoPlay());
        this.video.addEventListener('pause', () => this.onVideoPause());
        this.video.addEventListener('loadstart', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('error', (e) => this.onVideoError(e));
    }

    checkHLSSupport() {
        if (Hls.isSupported()) {
            this.updateStatus('HLS support detected ✓');
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.updateStatus('Native HLS support (Safari) ✓');
        } else {
            this.updateStatus('HLS not supported', 'error');
        }
    }

    playStream() {
        const url = this.streamUrlInput.value.trim();

        if (!url) {
            this.updateStatus('Please enter a stream URL', 'error');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.updateStatus('Invalid URL format', 'error');
            return;
        }

        this.currentUrl = url;
        this.streamStream(url);
    }

    streamStream(url) {
        try {
            this.showLoading();
            this.updateStatus('Connecting...');

            // Destroy existing HLS instance
            if (this.hls) {
                this.hls.destroy();
            }

            // Native HLS support (Safari)
            if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
                this.video.src = url;
                this.video.play();
                this.isPlaying = true;
                this.updateStatus('Playing (Native HLS)');
                this.urlText.textContent = url;
                return;
            }

            // HLS.js for other browsers
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                });

                this.hls.attachMedia(this.video);

                this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    this.hls.loadSource(url);
                });

                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.video.play();
                    this.isPlaying = true;
                    this.updateStatus('Playing ▶');
                    this.urlText.textContent = url;
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    this.handleHLSError(data);
                });

                this.hls.on(Hls.Events.LEVEL_SWITCHING, (event, data) => {
                    this.updateBitrate(data.level);
                });
            }
        } catch (error) {
            console.error('Error starting stream:', error);
            this.updateStatus('Error: ' + error.message, 'error');
            this.hideLoading();
        }
    }

    stopStream() {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        this.video.src = '';
        this.video.pause();
        this.isPlaying = false;
        this.hideLoading();
        this.updateStatus('Stopped ⏹');
        this.bitrateText.textContent = '--';
    }

    handleHLSError(data) {
        const errorType = data.type;
        const errorDetails = data.details;

        console.error('HLS Error:', { type: errorType, details: errorDetails });

        if (data.fatal) {
            switch (errorType) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                    this.updateStatus('Network Error - Check URL', 'error');
                    break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                    this.updateStatus('Media Error', 'error');
                    break;
                default:
                    this.updateStatus('Error: ' + errorDetails, 'error');
            }
            this.stopStream();
        }
    }

    updateBitrate(level) {
        if (this.hls && this.hls.levels[level]) {
            const bitrate = this.hls.levels[level].bitrate;
            const bandwidth = (bitrate / 1024 / 1024).toFixed(2);
            this.bitrateText.textContent = bandwidth + ' Mbps';
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return string.includes('.m3u8') || string.includes('.m3u');
        } catch (_) {
            return false;
        }
    }

    showLoading() {
        this.loadingSpinner.classList.add('active');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('active');
    }

    updateStatus(text, type = 'info') {
        this.statusText.textContent = text;
        this.statusText.style.color = type === 'error' ? '#ef4444' : '#10b981';
    }

    onVideoPlay() {
        this.hideLoading();
        this.updateStatus('Playing ▶');
    }

    onVideoPause() {
        this.updateStatus('Paused ⏸');
    }

    onVideoError(event) {
        console.error('Video Error:', event);
        this.updateStatus('Video Error - Invalid stream URL', 'error');
        this.hideLoading();
    }
}

// Initialize player when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StreamPlayer();
    });
} else {
    new StreamPlayer();
}