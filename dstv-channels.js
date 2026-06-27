/**
 * DSTV Live Channels URL Generator
 * Handles DSTV channel data and generates playable stream URLs
 */

class DSTVChannelManager {
    constructor() {
        // DSTV channel database with channel numbers and URLs
        this.channels = {
            // Catch Up (101)
            'catchup': {
                name: 'Catch Up',
                number: 101,
                category: 'News & Info',
                url: 'https://dstv-stream.example.com/catchup/stream.m3u8'
            },
            // News channels
            'eNews': {
                name: 'eNews',
                number: 140,
                category: 'News',
                url: 'https://dstv-stream.example.com/enews/live.m3u8'
            },
            'News24': {
                name: 'News24',
                number: 405,
                category: 'News',
                url: 'https://dstv-stream.example.com/news24/live.m3u8'
            },
            // Sports
            'SuperSport_Premiere': {
                name: 'SuperSport Premiere',
                number: 201,
                category: 'Sports',
                url: 'https://dstv-stream.example.com/supersport_premiere/hls.m3u8'
            },
            'SuperSport_Football': {
                name: 'SuperSport Football',
                number: 202,
                category: 'Sports',
                url: 'https://dstv-stream.example.com/supersport_football/hls.m3u8'
            },
            'SuperSport_Rugby': {
                name: 'SuperSport Rugby',
                number: 205,
                category: 'Sports',
                url: 'https://dstv-stream.example.com/supersport_rugby/hls.m3u8'
            },
            'SuperSport_Cricket': {
                name: 'SuperSport Cricket',
                number: 206,
                category: 'Sports',
                url: 'https://dstv-stream.example.com/supersport_cricket/hls.m3u8'
            },
            // Entertainment
            'M-Net': {
                name: 'M-Net',
                number: 101,
                category: 'Entertainment',
                url: 'https://dstv-stream.example.com/mnet/live.m3u8'
            },
            'Etv': {
                name: 'e.tv',
                number: 105,
                category: 'Entertainment',
                url: 'https://dstv-stream.example.com/etv/live.m3u8'
            },
            'SABC1': {
                name: 'SABC1',
                number: 301,
                category: 'Entertainment',
                url: 'https://dstv-stream.example.com/sabc1/live.m3u8'
            },
            'SABC2': {
                name: 'SABC2',
                number: 302,
                category: 'Entertainment',
                url: 'https://dstv-stream.example.com/sabc2/live.m3u8'
            },
            'SABC3': {
                name: 'SABC3',
                number: 303,
                category: 'Entertainment',
                url: 'https://dstv-stream.example.com/sabc3/live.m3u8'
            },
            // Movies
            'M-Net Movies': {
                name: 'M-Net Movies',
                number: 104,
                category: 'Movies',
                url: 'https://dstv-stream.example.com/mnet_movies/live.m3u8'
            },
            'Movie Zone': {
                name: 'Movie Zone',
                number: 306,
                category: 'Movies',
                url: 'https://dstv-stream.example.com/movie_zone/live.m3u8'
            },
            // Kids
            'CBeebies': {
                name: 'CBeebies',
                number: 382,
                category: 'Kids',
                url: 'https://dstv-stream.example.com/cbeebies/live.m3u8'
            },
            'Cartoon Network': {
                name: 'Cartoon Network',
                number: 301,
                category: 'Kids',
                url: 'https://dstv-stream.example.com/cartoon_network/live.m3u8'
            }
        };
    }

    /**
     * Get all available channels
     */
    getAllChannels() {
        return Object.values(this.channels);
    }

    /**
     * Get channels by category
     */
    getChannelsByCategory(category) {
        return Object.values(this.channels).filter(
            channel => channel.category.toLowerCase() === category.toLowerCase()
        );
    }

    /**
     * Get a specific channel by key
     */
    getChannel(channelKey) {
        return this.channels[channelKey] || null;
    }

    /**
     * Get channel by channel number
     */
    getChannelByNumber(number) {
        return Object.values(this.channels).find(ch => ch.number === number) || null;
    }

    /**
     * Get channel by name
     */
    getChannelByName(name) {
        return Object.values(this.channels).find(
            ch => ch.name.toLowerCase() === name.toLowerCase()
        ) || null;
    }

    /**
     * Parse DSTV channel data and create URL
     * Accepts: channel key, channel number, or channel name
     */
    parseAndCreateUrl(input) {
        let channel = null;

        // Try to parse as channel key first
        if (typeof input === 'string') {
            channel = this.channels[input];
        }

        // Try as number
        if (!channel && typeof input === 'number') {
            channel = this.getChannelByNumber(input);
        }

        // Try as string representation of number
        if (!channel && typeof input === 'string') {
            const num = parseInt(input);
            if (!isNaN(num)) {
                channel = this.getChannelByNumber(num);
            }
        }

        // Try as channel name
        if (!channel && typeof input === 'string') {
            channel = this.getChannelByName(input);
        }

        if (!channel) {
            throw new Error(`Channel not found: ${input}`);
        }

        return this.createStreamUrl(channel);
    }

    /**
     * Create HLS stream URL from channel data
     */
    createStreamUrl(channel) {
        if (!channel || !channel.url) {
            throw new Error('Invalid channel data');
        }

        // Validate it's an HLS URL
        if (!channel.url.includes('.m3u8')) {
            console.warn(`Warning: Channel ${channel.name} may not be a valid HLS stream URL`);
        }

        return {
            url: channel.url,
            channel: channel.name,
            number: channel.number,
            category: channel.category,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Build a playlist M3U format from multiple channels
     */
    createPlaylist(channelKeys = null) {
        const channels = channelKeys 
            ? channelKeys.map(key => this.getChannel(key)).filter(ch => ch !== null)
            : this.getAllChannels();

        let m3u = '#EXTM3U\n';
        m3u += '#EXT-X-VERSION:3\n\n';

        channels.forEach(channel => {
            m3u += `#EXTINF:-1,${channel.number} - ${channel.name}\n`;
            m3u += `${channel.url}\n`;
        });

        return m3u;
    }

    /**
     * Download playlist as .m3u file
     */
    downloadPlaylist(filename = 'dstv-channels.m3u') {
        const playlist = this.createPlaylist();
        const blob = new Blob([playlist], { type: 'application/x-mpegURL' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    /**
     * Get categories
     */
    getCategories() {
        const categories = new Set(Object.values(this.channels).map(ch => ch.category));
        return Array.from(categories).sort();
    }
}

// Initialize DSTV Channel Manager globally
const dstvManager = new DSTVChannelManager();
