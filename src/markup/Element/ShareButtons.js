import React, { useState } from 'react';

/**
 * ShareButtons Component
 * Social media share buttons for businesses
 */
const ShareButtons = ({
    url,
    title,
    description,
    image,
    showLabel = true,
    layout = 'horizontal', // 'horizontal' or 'vertical'
}) => {
    const [copied, setCopied] = useState(false);

    // Use current page URL if not provided
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareDescription = description || '';

    // Encode for URL
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}${image ? `&media=${encodeURIComponent(image)}` : ''}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };

    const handleShare = (platform) => {
        const url = shareLinks[platform];
        if (platform === 'email') {
            window.location.href = url;
        } else {
            window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
    };

    return (
        <div className={`share-buttons ${layout}`}>
            {showLabel && <h4 className="share-label">Share This Business</h4>}

            <div className="share-buttons-list">
                {/* Native Share (mobile) */}
                {navigator.share && (
                    <button
                        className="share-btn share-native"
                        onClick={handleNativeShare}
                        title="Share"
                    >
                        <i className="fa fa-share-alt"></i>
                        {layout === 'horizontal' && <span>Share</span>}
                    </button>
                )}

                {/* Facebook */}
                <button
                    className="share-btn share-facebook"
                    onClick={() => handleShare('facebook')}
                    title="Share on Facebook"
                >
                    <i className="fa fa-facebook"></i>
                    {layout === 'horizontal' && <span>Facebook</span>}
                </button>

                {/* Twitter/X */}
                <button
                    className="share-btn share-twitter"
                    onClick={() => handleShare('twitter')}
                    title="Share on Twitter"
                >
                    <i className="fa fa-twitter"></i>
                    {layout === 'horizontal' && <span>Twitter</span>}
                </button>

                {/* LinkedIn */}
                <button
                    className="share-btn share-linkedin"
                    onClick={() => handleShare('linkedin')}
                    title="Share on LinkedIn"
                >
                    <i className="fa fa-linkedin"></i>
                    {layout === 'horizontal' && <span>LinkedIn</span>}
                </button>

                {/* WhatsApp */}
                <button
                    className="share-btn share-whatsapp"
                    onClick={() => handleShare('whatsapp')}
                    title="Share on WhatsApp"
                >
                    <i className="fa fa-whatsapp"></i>
                    {layout === 'horizontal' && <span>WhatsApp</span>}
                </button>

                {/* Email */}
                <button
                    className="share-btn share-email"
                    onClick={() => handleShare('email')}
                    title="Share via Email"
                >
                    <i className="fa fa-envelope"></i>
                    {layout === 'horizontal' && <span>Email</span>}
                </button>

                {/* Copy Link */}
                <button
                    className={`share-btn share-copy ${copied ? 'copied' : ''}`}
                    onClick={handleCopyLink}
                    title={copied ? 'Copied!' : 'Copy Link'}
                >
                    <i className={`fa fa-${copied ? 'check' : 'link'}`}></i>
                    {layout === 'horizontal' && <span>{copied ? 'Copied!' : 'Copy Link'}</span>}
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
