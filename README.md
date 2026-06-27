# 🎮 Live Stream Player

A modern, web-based HLS (HTTP Live Streaming) player for viewing live streams in real-time. Built with vanilla JavaScript and HLS.js.

## Features

✅ **HLS Stream Support** - Play any HLS (.m3u8) stream  
✅ **Cross-Browser Compatible** - Works on Chrome, Firefox, Safari, Edge  
✅ **Adaptive Bitrate** - Automatically adjusts quality based on bandwidth  
✅ **Real-time Stats** - Monitor stream status and bitrate  
✅ **Modern UI** - Dark theme with gradient effects  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Easy to Use** - Just paste a stream URL and play  

## Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Enter an HLS stream URL (must end with `.m3u8`)
3. Click "Play Stream" or press Enter
4. Enjoy your stream!

### Example Stream URLs

Here are some test HLS streams you can try:

```
https://test-streams.mux.dev/x36xhzz/x3eoqm.m3u8
https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.m3u8
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.m3u8
```

## How to Use

### Method 1: Enter URL Manually
1. Paste your HLS stream URL in the input field
2. Click "Play Stream" or press Enter
3. Use video controls to play/pause/adjust volume

### Method 2: Use Presets
1. Click one of the preset buttons to load a sample stream
2. Stream will start automatically

### Method 3: Stop Stream
1. Click "Stop" to stop the current stream
2. Enter a new URL to stream something else

## Stream Requirements

- **Format**: HLS (HTTP Live Streaming)
- **File Extension**: `.m3u8`
- **CORS**: Stream must be CORS-enabled or served from same origin
- **Codec**: H.264 video, AAC audio (standard HLS codecs)

## Browser Support

| Browser | HLS Support | Status |
|---------|-------------|--------|
| Chrome | via HLS.js | ✅ Supported |
| Firefox | via HLS.js | ✅ Supported |
| Safari | Native | ✅ Supported |
| Edge | via HLS.js | ✅ Supported |
| Opera | via HLS.js | ✅ Supported |

## Technical Details

### Dependencies

- **HLS.js** - CDN hosted version for HLS streaming
- **No other dependencies** - Pure vanilla JavaScript

### File Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── player.js       # Stream player logic
└── README.md       # Documentation
```

## API Reference

### StreamPlayer Class

The `StreamPlayer` class handles all streaming functionality:

```javascript
const player = new StreamPlayer();

// Play a stream
player.playStream();

// Stop playback
player.stopStream();

// Update status
player.updateStatus('Custom message');
```

## Troubleshooting

### "Invalid URL format"
- Make sure the URL ends with `.m3u8`
- Verify the URL is correct and accessible
- Check that the URL uses HTTPS (not HTTP) for secure sites

### "Network Error - Check URL"
- The stream URL may be incorrect or offline
- Check your internet connection
- Ensure the stream is CORS-enabled

### "No video appears"
- Some streams may have CORS restrictions
- Try using a different test stream
- Check browser console for detailed error messages

### Stream won't start on Safari
- Safari uses native HLS support
- Make sure URL ends with `.m3u8`
- Verify the stream is compatible with Safari

## Customization

### Change Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --secondary-color: #ec4899;    /* Accent color */
    --background-color: #0f172a;   /* Dark background */
    --text-color: #e2e8f0;         /* Text color */
}
```

### Modify HLS.js Configuration

Edit the HLS configuration in `player.js`:

```javascript
this.hls = new Hls({
    debug: false,                  // Enable debug logs
    enableWorker: true,            /* Use Web Workers */
    lowLatencyMode: true,          /* Reduce latency */
    backBufferLength: 90,          /* Buffer duration */
});
```

## Performance Tips

- Use adaptive bitrate streams for best quality
- Enable low latency mode for live streams
- Test with multiple stream sources
- Monitor network conditions in DevTools

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - Feel free to use this in your projects

## Resources

- [HLS.js Documentation](https://github.com/video-dev/hls.js)
- [HTTP Live Streaming Specification](https://tools.ietf.org/html/rfc8216)
- [MDN Video Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

---

**Made with ❤️ for gamers and streamers**