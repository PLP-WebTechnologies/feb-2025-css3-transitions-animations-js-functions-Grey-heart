class PreferenceManager {
    constructor() {
        this.animatedBox = document.getElementById('animatedBox');
        this.preferencesDisplay = document.getElementById('preferencesDisplay');
        this.colors = ['#4a6fa5', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        this.colorIndex = 0;
        this.themes = new Map([
            ['light', '#f5f5f5'],
            ['dark', '#333'],
            ['pink', '#ffebee'],
            ['green', '#e8f5e9']
        ]);
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPreferences();
        this.updatePreferencesDisplay();
    }

    bindEvents() {
        // Box interactions
        this.animatedBox.addEventListener('click', () => this.handleBoxClick());
        
        // Button controls
        document.getElementById('toggleAnimation')
            .addEventListener('click', () => this.toggleAnimation());
        
        document.getElementById('changeColor')
            .addEventListener('click', () => this.changeColor());
        
        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTheme(e.target.dataset.theme);
                this.savePreference('theme', e.target.dataset.theme);
            });
        });
    }

    handleBoxClick() {
        this.animatedBox.style.transform = 'scale(0.9)';
        const originalText = this.animatedBox.textContent;
        
        setTimeout(() => {
            this.animatedBox.style.transform = '';
        }, 300);
        
        this.temporaryTextUpdate(originalText, 'Clicked!', 1000);
    }

    temporaryTextUpdate(original, temp, duration) {
        this.animatedBox.textContent = temp;
        setTimeout(() => {
            this.animatedBox.textContent = original;
        }, duration);
    }

    toggleAnimation() {
        this.animatedBox.classList.toggle('animate');
        this.savePreference('animationState', this.animatedBox.classList.contains('animate'));
        this.updatePreferencesDisplay();
    }

    changeColor() {
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        const newColor = this.colors[this.colorIndex];
        this.animatedBox.style.backgroundColor = newColor;
        this.savePreference('boxColor', newColor);
        this.updatePreferencesDisplay();
    }

    changeTheme(theme) {
        document.body.style.backgroundColor = this.themes.get(theme) || this.themes.get('light');
    }

    savePreference(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage unavailable:', e);
        }
    }

    loadPreferences() {
        const loaders = {
            animationState: value => {
                if (value === 'true') this.animatedBox.classList.add('animate');
            },
            boxColor: value => {
                if (this.colors.includes(value)) {
                    this.animatedBox.style.backgroundColor = value;
                    this.colorIndex = this.colors.indexOf(value);
                }
            },
            theme: value => {
                if (this.themes.has(value)) this.changeTheme(value);
            }
        };

        Object.entries(loaders).forEach(([key, handler]) => {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                if (value !== null) handler(value);
            } catch (e) {
                localStorage.removeItem(key);
            }
        });
    }

    updatePreferencesDisplay() {
        const animationState = this.animatedBox.classList.contains('animate') ? 'ON' : 'OFF';
        const boxColor = this.animatedBox.style.backgroundColor || this.colors[0];
        const theme = [...this.themes.entries()]
            .find(([_, color]) => color === document.body.style.backgroundColor)?.[0] || 'light';

        this.preferencesDisplay.innerHTML = `
            <div><strong>Animation:</strong> ${animationState}</div>
            <div><strong>Box Color:</strong> <span style="color:${boxColor}">${boxColor}</span></div>
            <div><strong>Theme:</strong> ${theme}</div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new PreferenceManager());
