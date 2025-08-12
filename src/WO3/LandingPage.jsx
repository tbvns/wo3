import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentFeature, setCurrentFeature] = useState(0);

    const examples = [
        {
            title: "Social Media Posts",
            description: "Create realistic Twitter, message conversations, and social media mockups",
            html: `
        <div class="twitter-post-wrapper">
          <div class="twitter-post-component">
            <div class="tp-header">
              <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png" 
                   class="tp-profile-img" alt="Profile">
              <div>
                <span class="tp-username">Jane Writer</span>
                <span class="tp-handle">@janewriter</span>
              </div>
            </div>
            <div class="tp-text">Just finished writing the most emotional chapter yet 😭 Can't wait for you all to read it! #fanfiction #writing</div>
            <div class="tp-timestamp">2:34 PM · Dec 8, 2024</div>
            <div class="tp-stats">
              <span>❤️ 247</span>
              <span>🔄 89</span>
              <span>💬 56</span>
            </div>
          </div>
        </div>
      `
        },
        {
            title: "Chat Conversations",
            description: "Build realistic message exchanges between characters",
            html: `
        <div class="message-wrapper">
          <div class="message-component">
            <div class="msg-header">
              <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png" 
                   class="msg-profile-img" alt="Profile">
              <div class="msg-name">Alex & Sam</div>
            </div>
            <div class="msg-bubble-container left">
              <div class="msg-bubble">
                <div class="msg-bubble-content left">Hey, are you coming to the party tonight?</div>
              </div>
            </div>
            <div class="msg-bubble-container right">
              <div class="msg-bubble">
                <div class="msg-bubble-content right">Wouldn't miss it! What time should I be there?</div>
              </div>
            </div>
          </div>
        </div>
      `
        },
        {
            title: "News Articles",
            description: "Create professional-looking news websites and articles",
            html: `
        <div class="news-website-wrapper style-1">
          <div class="news-website-preview">
            <div class="news-topbar" style="border-color: #F40439;">
              <div class="news-site-name" style="color: #c53030">The Daily Chronicle</div>
            </div>
            <div class="news-content-area">
              <h1 class="news-headline" style="color: #F86182">Local Hero Saves The Day</h1>
              <div class="news-subheadline" style="border-color: #F40439; color: #F40439; background: rgba(248,97,130,0.29)">
                In a stunning turn of events, our protagonist proves that anyone can make a difference.
              </div>
              <div class="news-article-content" style="color: #F86182">
                The streets were quiet when suddenly, a commotion broke out near the town square...
              </div>
            </div>
          </div>
        </div>
      `
        },
        {
            title: "Search Results",
            description: "Mock up Google searches and web results",
            html: `
        <div class="google-search-wrapper">
          <div class="google-search-component">
            <div class="google-search-bar">
              <span class="icon">🔍</span>
              <div class="query">how to write fanfiction</div>
            </div>
            <div class="google-search-result">
              <div class="gs-title">The Ultimate Guide to Writing Fanfiction</div>
              <div class="gs-url">https://writingcommunity.com/fanfic-guide</div>
              <div class="gs-description">Learn the essential tips and tricks for writing compelling fanfiction. From character development to plot structure...</div>
            </div>
          </div>
        </div>
      `
        }
    ];

    const features = [
        {
            icon: "✨",
            title: "Easy Formatting",
            description: "Bold, italic, underline, colors, fonts, and alignment - all with simple clicks"
        },
        {
            icon: "🎭",
            title: "UI Components",
            description: "Pre-built social media posts, chats, news articles, and search results"
        },
        {
            icon: "📁",
            title: "Work Management",
            description: "Save multiple projects, auto-save, backup and restore your work"
        },
        {
            icon: "🎨",
            title: "Custom Styling",
            description: "Dynamic CSS generation with custom colors, fonts, and layouts"
        },
        {
            icon: "📤",
            title: "AO3 Ready Export",
            description: "One-click export to HTML + CSS files ready for Archive of Our Own"
        },
        {
            icon: "🆓",
            title: "Forever Free",
            description: "100% free, open source, and always will be. No subscriptions, no limits"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentExample((prev) => (prev + 1) % examples.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [examples.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div className="landing-page">
            {/* Back to Hub Link */}
            <a href="https://tbvns.xyz" className="back-to-hub">
                ← Back to Hub
            </a>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="logo-section">
                        <img src="/wo3.svg" alt="WO3 Logo" className="logo" />
                        <div className="hero-text">
                            <h1>WO3: The Ultimate AO3 HTML Editor</h1>
                            <p className="hero-subtitle">
                                Create beautiful, professional HTML for Archive of Our Own without writing a single line of code.
                                Social media mockups, chat conversations, news articles, and more - all with a simple, intuitive editor.
                            </p>
                            <div className="hero-buttons">
                                <button onClick={onGetStarted} className="cta-button primary">
                                    🚀 Start Creating Now
                                </button>
                                <a
                                    href="https://github.com/tbvns/wo3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta-button secondary"
                                >
                                    ⭐ Star on GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Live Example Preview */}
                    <div className="example-preview">
                        <div className="preview-header">
                            <div className="preview-title">
                                {examples[currentExample].title}
                            </div>
                            <div className="preview-dots">
                                {examples.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`dot ${index === currentExample ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="preview-content-container">
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: examples[currentExample].html }}
                            />
                        </div>
                        <div className="preview-description">
                            {examples[currentExample].description}
                        </div>
                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div className="scroll-indicator">
                    <span>Scroll down</span>
                    <div className="scroll-arrow">↓</div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>Everything You Need for AO3 HTML</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card ${index === currentFeature ? 'highlighted' : ''}`}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <h2>From Idea to AO3 in 3 Simple Steps</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Write & Format</h3>
                                <p>Use our intuitive editor to write your content. Format text, add components, and style everything visually.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Add Components</h3>
                                <p>Insert social media posts, chat conversations, news articles, search results, and more with one click.</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Export to AO3</h3>
                                <p>Click export to get clean HTML and CSS files. Copy the CSS to your AO3 work skin, paste the HTML, and publish!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Export Demo */}
            <section className="export-demo">
                <div className="container">
                    <h2>Perfect AO3 Integration</h2>
                    <div className="demo-grid">
                        <div className="demo-item">
                            <h3>📄 Clean HTML Output</h3>
                            <div className="code-preview">
                <pre>{`<div class="google-search-wrapper">
  <div class="google-search-component">
    <div class="google-search-bar">
      <span class="icon">🔍</span>
      <div class="query">character name</div>
    </div>
    <div class="google-search-result">
      <div class="gs-title">Character Wiki</div>
      <div class="gs-url">https://wiki.com</div>
    </div>
  </div>
</div>`}</pre>
                            </div>
                        </div>
                        <div className="demo-item">
                            <h3>🎨 Optimized CSS Work Skin</h3>
                            <div className="code-preview">
                <pre>{`.google-search-component {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
  font-family: Arial, sans-serif;
}

.gs-title {
  color: #1a0dab;
  font-size: 18px;
}`}</pre>
                            </div>
                        </div>
                    </div>
                    <div className="export-features">
                        <div className="export-feature">
                            <span className="checkmark">✅</span>
                            <span>Automatically optimized for AO3</span>
                        </div>
                        <div className="export-feature">
                            <span className="checkmark">✅</span>
                            <span>No inline styles - clean separation</span>
                        </div>
                        <div className="export-feature">
                            <span className="checkmark">✅</span>
                            <span>Responsive and mobile-friendly</span>
                        </div>
                        <div className="export-feature">
                            <span className="checkmark">✅</span>
                            <span>Compatible with AO3's content policy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Source */}
            <section className="open-source">
                <div className="container">
                    <div className="open-source-content">
                        <div className="open-source-text">
                            <h2>Forever Free & Open Source</h2>
                            <p>
                                WO3 is completely free and always will be. No hidden costs, no subscriptions, no feature limitations.
                                Built by the fanfiction community, for the fanfiction community.
                            </p>
                            <ul className="benefits">
                                <li>✨ No account required - use it instantly</li>
                                <li>💾 All data stays in your browser - complete privacy</li>
                                <li>🔧 Open source - contribute or modify as needed</li>
                                <li>📱 Works on desktop, tablet, and mobile</li>
                                <li>🌍 No server dependency - works offline</li>
                            </ul>
                        </div>
                        <div className="github-card">
                            <div className="github-content">
                                <h3>Support the Project</h3>
                                <p>If WO3 helps you create amazing content, consider starring our repository!</p>
                                <a
                                    href="https://github.com/tbvns/wo3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-button"
                                >
                                    <span className="github-icon">⭐</span>
                                    Star on GitHub
                                    <span className="github-arrow">→</span>
                                </a>
                                <div className="github-stats">
                                    <div className="stat">
                                        <span className="stat-number">100%</span>
                                        <span className="stat-label">Free Forever</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">MIT</span>
                                        <span className="stat-label">License</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="final-cta">
                <div className="container">
                    <h2>Ready to Transform Your AO3 Stories?</h2>
                    <p>Join thousands of writers who are already creating stunning HTML content with WO3</p>
                    <button onClick={onGetStarted} className="cta-button primary large">
                        🎯 Start Creating Now - It's Free!
                    </button>
                    <div className="cta-benefits">
                        <span>✅ No registration</span>
                        <span>✅ Instant access</span>
                        <span>✅ Works in your browser</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
