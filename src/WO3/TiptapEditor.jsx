import React, { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { ResizableImage } from "./ResizableImage";
import GapCursor from "@tiptap/extension-gapcursor";
import ComponentInsertModal from "./ComponentInsertModal";
import WorkManager from "./WorkManager";

import "./TiptapEditor.css";
import { GoogleSearchExtension } from "./GoogleSearchExtension.jsx";
import { TwitterPostExtension } from "./TwitterPostExtension.js";
import { MessageExtension } from "./MessageExtension.js";
import { SnapchatExtension } from "./SnapchatExtension.js";
import { NewsWebsiteExtension } from "./NewsWebsiteExtension.js";
import {EmailExtension} from "./EmailExtension.jsx";
import {InstagramPostExtension} from "./InstagramPostExtension.js";
import ExportModal from "./ExportModal.jsx";
import poisonHtml from "./poisoning.js";

const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            fontSize: {
                default: null,
                parseHTML: (el) => el.style.fontSize || null,
                renderHTML: (attrs) => {
                    if (!attrs.fontSize) return {};
                    return { style: `font-size: ${attrs.fontSize}` };
                },
            },
        };
    },
});

function buildBaseSkinCSS() {
    return `
/* Base skin generated at export time */

/* Override AO3 paragraphs margin */
p {
  margin: 0px;
}

p h1 h2 h3 span {
  word-wrap: normal !important;
  word-break: normal !important;
  white-space: normal !important;
  overflow-wrap: normal !important;
}

/* Buttons */
.button-component-wrapper{display:inline-block;margin:5px;}
.button-component{color:#fff;padding:8px 16px;border:0;border-radius:4px;
  font-size:14px;cursor:pointer;text-decoration:none;}
.btn-primary{background:#007bff;}
.btn-secondary{background:#6c757d;}
.btn-success{background:#28a745;}

/* Center wrappers */
.google-search-wrapper,.twitter-post-wrapper,.message-wrapper,.snapchat-wrapper,.news-website-wrapper{
  max-width:800px;margin:16px auto;
}

/* Google Search */
.google-search-component{border:1px solid #ddd;border-radius:8px;padding:16px;
  background:#fff;font-family:Arial,sans-serif;line-height:1.35;color:#0f1419;}
.google-search-bar{display:flex;align-items:center;border:1px solid #ccc;
  border-radius:24px;padding:8px 16px;margin-bottom:16px;}
.google-search-bar .icon{margin-right:8px;color:#888;}
.google-search-bar .query{flex:1;font-size:16px;line-height:1.2;text-align:left;}
.google-search-result{margin:16px 0 20px 0;}
.gs-title{color:#1a0dab;font-size:18px;line-height:1.25;}
.gs-url{color:#006621;font-size:13px;line-height:1.25;margin:2px 0 6px 0;}
.gs-description{color:#545454;font-size:14px;line-height:1.35;}

/* Twitter Post */
.twitter-post-component {
  border: 1px solid #e1e8ed;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  max-width: 550px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  font-size: 15px;
  line-height: 1.35;
  color: #0f1419;
}

.tp-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.tp-profile-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
}

.tp-username {
  font-weight: bold;
  margin-right: 4px;
}

.tp-handle {
  color: #536471;
}

.tp-text {
  margin: 10px 0 8px 0;
}

.tp-timestamp {
  color: #536471;
  font-size: 13px;
  margin-bottom: 8px;
}

.tp-action img.tp-icon {
  width: 18px;
  height: 18px;
}

.tp-action.liked {
  color: #f91880;
}

.tp-action.retweeted {
  color: #00ba7c;
}

.tp-stats {
  display: flex;
  color: #536471;
  font-size: 13px;
  align-items: center;
}

.tp-stats > span {
  margin-right: 24px;
}

.tp-stats > span:last-child {
  margin-right: 0;
}

.tp-stats img.tp-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}

.tp-stats .liked {
  color: #f91880;
}

.tp-stats .retweeted {
  color: #00ba7c;
}

/* Message */
.message-component{border:1px solid #ddd;border-radius:8px;padding:16px;
  background:#fff;font-family:Arial,sans-serif;line-height:1.3;color:#0f1419;}
.msg-header{display:flex;align-items:center;margin-bottom:16px;}
.msg-profile-img{width:48px;height:48px;border-radius:50%;margin-right:8px;}
.msg-name{font-weight:bold;font-size:16px;}
.msg-bubble-container{display:flex;margin-bottom:12px;}
.msg-bubble-container.left{justify-content:flex-start;}
.msg-bubble-container.right{justify-content:flex-end;}
.msg-bubble{max-width:70%;}
.msg-bubble-content{padding:8px 12px;line-height:1.25;border-radius:18px;}
.msg-bubble-content.left{background:#f1f0f0;color:#000;
  border-radius:18px 18px 18px 5px;}
.msg-bubble-content.right{background:#007bff;color:#fff;
  border-radius:18px 18px 5px 18px;}

/* Group Chat (previously snapchat) */
.snapchat-component{border:1px solid #ddd;border-radius:8px;padding:16px;background:#fff;font-family:Arial,sans-serif;line-height:1.3;color:#0f1419;}
.sc-header{display:flex;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee;}
.sc-group-icon{width:48px;height:48px;border-radius:50%;margin-right:12px;}
.sc-group-name{font-weight:bold;font-size:18px;flex:1;}
.sc-member-count{font-size:12px;color:#666;}
.sc-messages{margin-top:16px;}
.sc-messages>*+*{margin-top:16px;}
.sc-message-container{margin-bottom:0;}
.sc-message-name{font-size:12px;color:#666;font-weight:500;margin-bottom:4px;margin-left:40px;}
.sc-message{display:flex;align-items:flex-end;}
.sc-message>*+*{margin-left:8px;}
.sc-msg-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;}
.sc-msg-bubble{color:#000;padding:8px 12px;border-radius:18px 18px 18px 5px;word-wrap:break-word;position:relative;max-width:70%;}

/* News Website Base */
.news-website-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  margin: 16px auto;
  max-width: 800px;
}

.news-website-preview {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.news-topbar {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  position: relative;
  margin: 0; /* Full width */
}

.news-content-area {
  padding: 16px; /* Padding for content only */
}

.news-site-link,
.news-site-name {
  text-decoration: none;
}

.news-headline {
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.news-subheadline {
  margin: 0 0 20px 0;
  font-weight: 400;
  line-height: 1.3;
}

.news-article-content {
  line-height: 1.7;
  margin-bottom: 20px;
}

/* Style 1 - Classic News */
.style-1 .news-topbar {
  border-bottom: 4px double;
  font-family: 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 18px;
  padding: 12px 20px;
}
.style-1 .news-headline {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: bold;
  font-size: 42px;
  margin-bottom: 8px;
}
.style-1 .news-subheadline {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
  border-left: 4px solid;
  padding-left: 16px;
  margin: 16px 0 24px 0;
}
.style-1 .news-article-content {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  line-height: 1.8;
  text-align: justify;
  column-gap: 30px;
  margin-top: 24px;
}

/* Style 2 - Modern Tech */
.style-2 .news-topbar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 16px;
  padding: 16px 20px;
}
.style-2 .news-headline {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 800;
  font-size: 36px;
  text-transform: uppercase;
  letter-spacing: -1px;
  margin-bottom: 12px;
}
.style-2 .news-subheadline {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  font-weight: 300;
  background: #f8f9fa;
  padding: 12px 16px;
  border-left: 4px solid;
  margin: 16px 0 24px 0;
  border-radius: 0 8px 8px 0;
}
.style-2 .news-article-content {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.7;
}

/* Style 3 - Editorial */
.style-3 .news-topbar {
  border-bottom: 3px solid;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 22px;
  font-style: italic;
  position: relative;
  padding: 12px 20px;
}
.style-3 .news-topbar::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 3px;
}
.style-3 .news-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 48px;
  font-style: italic;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.style-3 .news-subheadline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  font-style: italic;
  text-align: center;
  border-top: 1px solid;
  border-bottom: 1px solid;
  padding: 16px 0;
  margin: 20px 0 28px 0;
}
.style-3 .news-article-content {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  line-height: 1.8;
  text-align: justify;
  text-indent: 2em;
}

/* Style 4 - Minimalist */
.style-4 .news-topbar {
  border: none;
  background: transparent;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 100;
  font-size: 14px;
  text-transform: lowercase;
  letter-spacing: 4px;
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid;
}

.style-4 .news-headline {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-weight: 100;
  font-size: 54px;
  text-align: center;
  margin: 40px 0 20px 0;
  letter-spacing: -2px;
  line-height: 0.9;
}

.style-4 .news-subheadline {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  margin: 20px auto 40px auto;
  max-width: 600px;
  line-height: 1.4;
}

.style-4 .news-article-content {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.9;
  max-width: 650px;
  margin: 0 auto;
  font-weight: 300;
}

/* Email */
.email-wrapper {
  background: #fff;
  font-family: Arial, sans-serif;
  color: #202124;
}

.email-wrapper.receive {
  padding: 0 16px 16px 16px;
}

.eh-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 8px 0;
  border-bottom: 1px solid #e0e3e7;
}

.eh-subject {
  font-size: 20px;
  font-weight: 500;
}

.eh-actions {
  display: flex;
  color: #5f6368;
}

.eh-actions > * + * {
  margin-left: 8px;
}

.eh-icon {
  display: inline-block;
}

.em-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e3e7;
}

/* Avatar */
.em-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex: 0 0 auto;
  margin-right: 12px;
}

.em-content {
  flex: 1 1 auto;
  min-width: 0;
}

.em-from-row {
  font-weight: 600;
}

.em-from-email {
  color: #5f6368;
  margin-left: 6px;
}

/* To row (secondary info) */
.em-to-row {
  color: #5f6368;
  font-size: 13px;
  margin-top: 2px;
}

.em-time {
  color: #5f6368;
  font-size: 12px;
  flex: 0 0 auto;
  margin-left: 12px;
}

.email-body {
  padding-top: 8px;
  line-height: 1.6;
}

.email-wrapper.compose {
  padding: 12px;
}

.email-compose-window {
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
}

.ec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #404040;
  color: #fff;
  padding: 8px 12px;
}

.ec-title {
  font-size: 14px;
  font-weight: 500;
}

.ec-window-actions {
  display: flex;
}

.ec-window-actions > * + * {
  margin-left: 6px;
}

.ec-icon {
  display: inline-block;
}

.ec-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f3f4;
}

.ec-row > * + * {
  margin-left: 8px;
}

.ec-label {
  width: 72px;
  color: #5f6368;
  font-size: 13px;
  flex: 0 0 auto;
}

.ec-value {
  flex: 1 1 auto;
  min-height: 18px;
}

.ec-inline {
  display: flex;
}

.ec-inline > * + * {
  margin-left: 10px;
}

.ec-inline-link {
  color: #1a73e8;
  cursor: pointer;
}

.ec-body {
  min-height: 120px;
  padding: 12px;
}

.ec-actions {
  display: flex;
  padding: 10px 12px 12px 12px;
}

.ec-actions > * + * {
  margin-left: 8px;
}

.ec-btn {
  padding: 6px 12px;
  border: 1px solid #dadce0;
  border-radius: 18px;
  background: #fff;
  display: inline-block;
}

.ec-btn.primary {
  background: #1a73e8;
  color: #fff;
  border-color: #1a73e8;
}

@media (max-width: 600px) {
  .em-time {
    width: 100%;
    text-align: right;
    margin-left: 0;
    margin-top: 4px;
  }
}

/* Instagram Post - AO3 Compatible */
.instagram-post-wrapper {
  max-width: 500px;
  margin: 16px auto;
}

.instagram-post-component {
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: #262626;
}

.ig-header {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #efefef;
}

.ig-profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.ig-user-info {
  flex: 1;
}

.ig-username {
  font-weight: 600;
}

.ig-location {
  font-size: 12px;
  color: #8e8e8e;
}

.ig-menu {
  cursor: pointer;
  padding: 8px;
}

.ig-image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #f5f5f5;
  overflow: hidden;
}

.ig-post-image {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
}

.ig-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8e8e8e;
  text-align: center;
}

.ig-placeholder-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.ig-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
}

.ig-action-buttons {
  display: flex;
}

.ig-action-buttons > * {
  margin-right: 16px;
}

.ig-action-buttons > *:last-child {
  margin-right: 0;
}

.ig-icon {
  cursor: pointer;
  padding: 4px;
}

.ig-likes {
  padding: 0 16px 8px;
  font-weight: 600;
}

.ig-caption {
  padding: 0 16px 8px;
  line-height: 1.4;
}

.ig-caption-username {
  font-weight: 600;
  margin-right: 6px;
}

.ig-comments {
  padding: 0 16px 8px;
}

.ig-comment {
  margin-bottom: 4px;
  line-height: 1.4;
}

.ig-comment-username {
  font-weight: 600;
  margin-right: 6px;
}

.ig-timestamp {
  padding: 0 16px 16px;
  font-size: 10px;
  color: #8e8e8e;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

/* Image alignment container */
.image-align-container {
  display: flex;
  width: 100%;
}

.image-align-container.ta-left {
  justify-content: flex-start;
}

.image-align-container.ta-center {
  justify-content: center;
}

.image-align-container.ta-right {
  justify-content: flex-end;
}

.image-align-container.ta-justify {
  justify-content: space-between;
}

/* Resizable image wrapper (width comes from dynamic classes) */
.resizable-image-wrapper{line-height:0;margin:10px 0;}

`.trim();
}

function toHexColor(input) {
    if (!input) return null;
    const s = `${input}`.trim().toLowerCase();
    if (s.startsWith("#")) {
        return s.length === 4
            ? `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
            : s;
    }
    const m = s.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return null;
    const r = (+m[1]).toString(16).padStart(2, "0");
    const g = (+m[2]).toString(16).padStart(2, "0");
    const b = (+m[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

function num(val) {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : null;
}

function cleanParagraphs(doc) {
    const ps = Array.from(doc.querySelectorAll("p"));
    ps.forEach((p) => {
        const hasText = (p.textContent || "").trim().length > 0;
        const onlyBrs =
            !hasText &&
            Array.from(p.childNodes).every(
                (n) =>
                    (n.nodeType === 1 &&
                        n.nodeName.toLowerCase() === "br") ||
                    (n.nodeType === 3 && !n.textContent.trim())
            );
        if (onlyBrs) {
            p.remove();
            return;
        }
        if (!hasText) {
            const wrapsBlocks = Array.from(p.children).some((el) =>
                /^(div|img|ul|ol|table|blockquote|figure|iframe)$/.test(
                    el.tagName.toLowerCase()
                )
            );
            if (wrapsBlocks) {
                while (p.firstChild) {
                    p.parentNode.insertBefore(p.firstChild, p);
                }
                p.remove();
            }
        }
    });
}

function extractDynamicStylesAndClasses(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    cleanParagraphs(doc);

    // Process news website components - decode and parse their content
    const newsComponents = doc.querySelectorAll('.news-website-wrapper');
    newsComponents.forEach(wrapper => {
        const contentArea = wrapper.querySelector('.news-article-content');
        if (contentArea) {
            // Get the content attribute from the wrapper
            const contentAttr = wrapper.getAttribute('content');
            if (contentAttr) {
                // Parse the HTML content and replace the text content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = contentAttr;
                contentArea.innerHTML = tempDiv.innerHTML;
            }
        }
    });

    //Email component manager
    const emailComponents = doc.querySelectorAll('.email-wrapper');
    emailComponents.forEach(wrapper => {
        const bodyElement = wrapper.querySelector('.email-body, .ec-body');
        if (bodyElement) {
            // Get the body content from the wrapper's attribute
            const bodyAttr = wrapper.getAttribute('body');
            if (bodyAttr) {
                // Set the HTML content directly
                bodyElement.innerHTML = bodyAttr;
            }
        }
    });

    // Process resizable image wrappers to ensure alignment is preserved
    const imageWrappers = doc.querySelectorAll('.resizable-image-wrapper');
    imageWrappers.forEach(wrapper => {
        let textAlign = wrapper.getAttribute('data-text-align') || wrapper.style.textAlign || 'left';
        textAlign = textAlign.trim().toLowerCase();

        // Create a new container div
        const container = doc.createElement('div');
        container.classList.add('image-align-container', `ta-${textAlign}`);

        // Insert container before wrapper and move wrapper inside it
        wrapper.parentNode.insertBefore(container, wrapper);
        container.appendChild(wrapper);

        // Remove inline text-align from wrapper
        wrapper.style.textAlign = '';
        wrapper.removeAttribute('data-text-align');
    });

    // Wrap aligned images in a flex container so alignment works in exported HTML
    const allImages = doc.querySelectorAll("img");
    allImages.forEach(img => {
        // Detect alignment from data attribute, style, or class
        let textAlign =
            img.getAttribute("data-text-align") ||
            img.style.textAlign ||
            Array.from(img.classList).find(c => c.startsWith("ta-"))?.replace("ta-", "") ||
            null;

        if (textAlign) {
            textAlign = textAlign.trim().toLowerCase();

            // Create container
            const container = doc.createElement("div");
            container.classList.add("image-align-container", `ta-${textAlign}`);

            // Insert container before image and move image inside
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);

            // Remove inline text-align from image
            img.style.textAlign = "";
            img.removeAttribute("data-text-align");
        }
    });

    const buckets = {
        color: new Map(),
        "background-color": new Map(),
        "border-color": new Map(),
        "border-top-color": new Map(),
        "border-right-color": new Map(),
        "border-bottom-color": new Map(),
        "border-left-color": new Map(),
        "font-size": new Map(),
        "text-align": new Map(),
        width: new Map(),
    };

    const ensureRule = (prop, value) => {
        if (!value) return null;
        let key = value.trim();

        if (
            prop === "color" ||
            prop === "background-color" ||
            prop.startsWith("border-")
        ) {
            const hex = toHexColor(value);
            if (!hex) return null;
            key = hex;
        }

        if (prop === "font-size") {
            const n = num(value);
            if (n == null) return null;
            key = `${Math.round(n)}px`;
        }

        if (prop === "width") {
            key = value.trim();
        }

        if (buckets[prop] && !buckets[prop].has(key)) {
            let cls = "";
            if (prop === "color") cls = `c-${key.replace("#", "")}`;
            if (prop === "background-color") cls = `bg-${key.replace("#", "")}`;
            if (prop === "border-color") cls = `bc-${key.replace("#", "")}`;
            if (prop === "border-top-color") cls = `btc-${key.replace("#", "")}`;
            if (prop === "border-right-color") cls = `brc-${key.replace("#", "")}`;
            if (prop === "border-bottom-color") cls = `bbc-${key.replace("#", "")}`;
            if (prop === "border-left-color") cls = `blc-${key.replace("#", "")}`;
            if (prop === "font-size") cls = `fs-${key.replace("px", "")}`;
            if (prop === "text-align") cls = `ta-${key}`;
            if (prop === "width") {
                const isPct = key.includes("%");
                const n = num(key);
                if (n == null) return null;
                cls = `w-${isPct ? `${Math.round(n)}p` : `${Math.round(n)}`}`;
            }
            buckets[prop].set(key, cls);
            return cls;
        }
        if (buckets[prop]) {
            return buckets[prop].get(key);
        }
    };

    // Process all elements with style attributes (now including the parsed news content)
    Array.from(doc.querySelectorAll("[style]")).forEach((el) => {
        const style = el.getAttribute("style") || "";
        const keep = [];
        style
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((decl) => {
                const i = decl.indexOf(":");
                if (i === -1) return;
                const prop = decl.slice(0, i).trim().toLowerCase();
                const val = decl.slice(i + 1).trim();
                if (
                    prop === "color" ||
                    prop === "background-color" ||
                    prop.startsWith("border-") ||
                    prop === "font-size" ||
                    prop === "text-align" ||
                    prop === "width"
                ) {
                    const cls = ensureRule(prop, val);
                    if (cls) el.classList.add(cls);
                } else {
                    keep.push(decl);
                }
            });
        if (keep.length) el.setAttribute("style", keep.join("; "));
        else el.removeAttribute("style");
    });

    let css = "";
    buckets.color.forEach((cls, key) => (css += `.${cls}{color:${key};}\n`));
    buckets["background-color"].forEach(
        (cls, key) => (css += `.${cls}{background-color:${key};}\n`)
    );
    buckets["border-color"].forEach(
        (cls, key) => (css += `.${cls}{border-color:${key} !important;border-style:solid !important;}\n`)
    );
    buckets["border-top-color"].forEach(
        (cls, key) => (css += `.${cls}{border-top-color:${key} !important;border-top-style:solid !important;}\n`)
    );
    buckets["border-right-color"].forEach(
        (cls, key) => (css += `.${cls}{border-right-color:${key} !important;border-right-style:solid !important;}\n`)
    );
    buckets["border-bottom-color"].forEach(
        (cls, key) => (css += `.${cls}{border-bottom-color:${key} !important;border-bottom-style:solid !important;}\n`)
    );
    buckets["border-left-color"].forEach(
        (cls, key) => (css += `.${cls}{border-left-color:${key} !important;border-left-style:solid !important;}\n`)
    );
    buckets["font-size"].forEach(
        (cls, key) => (css += `.${cls}{font-size:${key};}\n`)
    );
    buckets["text-align"].forEach(
        (cls, key) => (css += `.${cls}{text-align:${key};}\n`)
    );
    buckets.width.forEach(
        (cls, key) => (css += `.${cls}{width:${key};}\n`)
    );

    return { html: doc.body.innerHTML, css };
}

function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function TiptapEditor() {
    const [showComponentModal, setShowComponentModal] = useState(false);
    const [showWorkManager, setShowWorkManager] = useState(false);
    const [currentWorkId, setCurrentWorkId] = useState(null);
    const [workName, setWorkName] = useState('');
    const [lastSaved, setLastSaved] = useState(null);
    const autoSaveTimeoutRef = useRef(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const exportDataRef = useRef({ html: '', skin: '' });
    const [protectionLevel, setProtectionLevel] = useState(0);

    const performAutoSave = useCallback((editorInstance, workId, name) => {
        if (!editorInstance || !workId) return;

        const content = editorInstance.getHTML();
        const workData = {
            id: workId,
            name: name,
            content,
            updatedAt: new Date().toISOString()
        };

        // Save individual work content
        localStorage.setItem(`tiptap-work-${workId}`, JSON.stringify(workData));

        // Update works list
        const savedWorks = JSON.parse(localStorage.getItem('tiptap-works') || '[]');
        const workIndex = savedWorks.findIndex(w => w.id === workId);
        if (workIndex >= 0) {
            savedWorks[workIndex] = { ...savedWorks[workIndex], name: name, updatedAt: workData.updatedAt };
            localStorage.setItem('tiptap-works', JSON.stringify(savedWorks));
        }

        setLastSaved(new Date());
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            ResizableImage.configure({ inline: false }),
            GapCursor,
            Placeholder.configure({ placeholder: "Start typing here..." }),
            Heading.configure({ levels: [1, 2, 3] }),
            TextStyle,
            Color,
            FontSize,
            TextAlign.configure({
                types: ["heading", "paragraph", "resizableImage"],
            }),
            GoogleSearchExtension,
            TwitterPostExtension,
            MessageExtension,
            SnapchatExtension,
            NewsWebsiteExtension,
            EmailExtension,
            InstagramPostExtension,
        ],
        editorProps: {
            attributes: {
                class: "tiptap-editor-content",
                style:
                    `outline:none;font-size:16px;line-height:1.6;padding:2rem;min-height:50vh;`,
            },
        },
        onUpdate: ({ editor: editorInstance }) => {
            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // Set new timeout for auto-save
            autoSaveTimeoutRef.current = setTimeout(() => {
                performAutoSave(editorInstance, currentWorkId, workName);
            }, 500);
        },
    });

    const createDefaultWork = useCallback(() => {
        const defaultWork = {
            id: Date.now().toString(),
            name: 'Untitled Work',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const savedWorks = JSON.parse(localStorage.getItem('tiptap-works') || '[]');
        savedWorks.push(defaultWork);
        localStorage.setItem('tiptap-works', JSON.stringify(savedWorks));

        // Also save the empty work content
        localStorage.setItem(`tiptap-work-${defaultWork.id}`, JSON.stringify(defaultWork));

        setCurrentWorkId(defaultWork.id);
        setWorkName(defaultWork.name);

        // Clear the editor content
        if (editor) {
            editor.commands.setContent('');
        }
    }, [editor]);

    const loadWork = useCallback((workId, name) => {
        const workData = JSON.parse(localStorage.getItem(`tiptap-work-${workId}`) || '{}');

        setCurrentWorkId(workId);
        setWorkName(name);

        if (editor) {
            const content = workData.content || '';
            editor.commands.setContent(content);
        }

        setLastSaved(workData.updatedAt ? new Date(workData.updatedAt) : null);
    }, [editor]);

    useEffect(() => {
        const savedWorks = JSON.parse(localStorage.getItem('tiptap-works') || '[]');
        if (savedWorks.length > 0) {
            const latestWork = savedWorks.reduce((latest, current) =>
                new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
            );
            loadWork(latestWork.id, latestWork.name);
        } else {
            createDefaultWork();
        }
    }, [createDefaultWork, loadWork]);

    // Auto-save when workName changes
    useEffect(() => {
        if (editor && currentWorkId && workName) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
            autoSaveTimeoutRef.current = setTimeout(() => {
                performAutoSave(editor, currentWorkId, workName);
            }, 500);
        }
    }, [workName, currentWorkId, editor, performAutoSave]);

    const saveToComputer = () => {
        if (!editor) return;
        const rawHTML = editor.getHTML();
        const { html, css: dynamicCss } = extractDynamicStylesAndClasses(rawHTML);

        const workData = {
            name: workName,
            content: rawHTML,
            cleanedHtml: html,
            css: `${buildBaseSkinCSS()}\n\n${dynamicCss}`.trim(),
            createdAt: new Date().toISOString(),
            version: "1.0"
        };

        downloadFile(`${workName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wo3`, JSON.stringify(workData, null, 2), "application/json");
    };

    const exportFiles = async () => {
        if (!editor) return;

        let raw = editor.getHTML();

        if (protectionLevel > 0) {
            try {
                raw = await poisonHtml(raw, protectionLevel);
            } catch (error) {
                console.error("Failed to apply AI protection:", error);
                alert("Failed to apply AI protection. Exporting without protection.");
            }
        }

        const {html, css: dynamicCss} = extractDynamicStylesAndClasses(raw);
        const skin = `${buildBaseSkinCSS()}\n\n${dynamicCss}`.trim();

        // Store export data
        exportDataRef.current = {html, skin};

        // Show export modal
        setShowExportModal(true);
    };

    const copyContentToClipboard = () => {
        navigator.clipboard.writeText(exportDataRef.current.html);
        alert("Content copied to clipboard!");
    };

    const copyStylesToClipboard = () => {
        navigator.clipboard.writeText(exportDataRef.current.skin);
        alert("Workskin copied to clipboard!");
    };

    const downloadExportFiles = () => {
        downloadFile("content.html", exportDataRef.current.html, "text/html");
        downloadFile("skin.css", exportDataRef.current.skin, "text/css");
    };

    if (!editor) return null;

    const addImage = () => {
        const url = prompt("Enter image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addHTML = () => {
        const html = prompt("Enter custom HTML");
        if (html) editor.commands.insertContent(html);
    };

    const insertComponent = (type) => {
        editor.chain().focus().insertContent({ type, attrs: {} }).run();
        setShowComponentModal(false);
    };

    return (
        <div className="editor-container">
            <title>{"WO3 - " + workName.trim()}</title>
            {/* Header */}
            <div className="editor-header">
                <div className="header-left">
                    <a href="/">
                        <span className="material-symbols-outlined home-button">
                            close
                        </span>
                    </a>
                    <input
                        type="text"
                        value={workName}
                        onChange={(e) => setWorkName(e.target.value)}
                        className="work-name-input"
                        placeholder="Work name..."
                    />
                    <button
                        onClick={() => setShowWorkManager(true)}
                        className="work-manager-btn"
                    >
                        📁 Manage Works
                    </button>
                    {lastSaved && (
                        <span className="last-saved">
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <div className="header-right">
                    <button onClick={saveToComputer} className="save-computer-btn">
                        💾 Save to Computer (.wo3)
                    </button>
                    <button onClick={exportFiles} className="export-btn">
                        📥 Export
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="editor-toolbar">
                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    >
                        <u>U</u>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    >
                        <em>I</em>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    >
                        <s>S</s>
                    </button>
                </div>

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                    >
                        1. List
                    </button>
                </div>

                <div className="toolbar-group">
                    <button
                        onClick={() => {
                            const isActive = editor.isActive("link");
                            if (isActive) {
                                editor.chain().focus().unsetLink().run();
                                return;
                            }
                            const url = prompt("Enter link URL");
                            if (url)
                                editor.chain().focus().setLink({ href: url }).run();
                        }}
                        className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
                    >
                        🔗 Link
                    </button>
                    <button onClick={addImage} className="toolbar-btn">
                        🖼 Image
                    </button>
                    <button onClick={addHTML} className="toolbar-btn">
                        💻 HTML
                    </button>
                    <button
                        onClick={() => setShowComponentModal(true)}
                        className="toolbar-btn component-btn"
                    >
                        + Component
                    </button>
                </div>

                <div className="toolbar-group">
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={`toolbar-btn ${editor.isActive({textAlign: 'left'}) ? 'active' : ''}`}
                    >
                        ⬅
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={`toolbar-btn ${editor.isActive({textAlign: 'center'}) ? 'active' : ''}`}
                    >
                        ⬍
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={`toolbar-btn ${editor.isActive({textAlign: 'right'}) ? 'active' : ''}`}
                    >
                        ➡
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                        className={`toolbar-btn ${editor.isActive({textAlign: 'justify'}) ? 'active' : ''}`}
                    >
                        ☰
                    </button>
                </div>

                <div className="toolbar-group">
                    <select
                        className="toolbar-select"
                        onChange={(e) => {
                            const level = parseInt(e.target.value, 10);
                            if (level === 0) {
                                editor.chain().focus().setParagraph().run();
                            } else {
                                editor.chain().focus().toggleHeading({ level }).run();
                            }
                        }}
                        value={
                            editor.isActive('heading', { level: 1 }) ? 1 :
                                editor.isActive('heading', { level: 2 }) ? 2 :
                                    editor.isActive('heading', { level: 3 }) ? 3 : 0
                        }
                    >
                        <option value="0">Paragraph</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                    </select>

                    <input
                        type="number"
                        min="8"
                        max="72"
                        defaultValue="16"
                        className="toolbar-input"
                        onChange={(e) => {
                            const px = `${e.target.value}px`;
                            editor.chain().focus().setMark("textStyle", { fontSize: px }).run();
                        }}
                    />

                    <input
                        type="color"
                        onChange={(e) => {
                            editor.chain().focus().setColor(e.target.value).run();
                        }}
                        title="Text color"
                        className="toolbar-color"
                    />
                    <button
                        onClick={() => editor.chain().focus().unsetColor().run()}
                        className="toolbar-btn"
                    >
                        ✖ Color
                    </button>
                </div>
            </div>

            {/* Editor area */}
            <div className="editor-main">
                <div className="editor-paper">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Modals */}
            {showComponentModal && (
                <ComponentInsertModal
                    onInsert={insertComponent}
                    onClose={() => setShowComponentModal(false)}
                />
            )}

            {showWorkManager && (
                <WorkManager
                    onSelectWork={loadWork}
                    onClose={() => setShowWorkManager(false)}
                    currentWorkId={currentWorkId}
                />
            )}

            {showExportModal && (
                <ExportModal
                    onClose={() => setShowExportModal(false)}
                    onCopyContent={copyContentToClipboard}
                    onCopyStyles={copyStylesToClipboard}
                    onDownload={downloadExportFiles}
                    onExport={exportFiles}
                    setLevel={setProtectionLevel}
                />
            )}
        </div>
    );
}
