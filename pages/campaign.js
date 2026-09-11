import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { EMAIL_TEMPLATES } from '../lib/templates';

const PAGE_CSS = `
  :root {
    --ink: #1e1b3a; --muted: #6b7280; --bg: #f2f1fb; --line: #e6e4f7;
    --accent1: #6d5ef8; --accent2: #8b5cf6; --accent-text: #4c3fd7;
    --green: #16a34a; --green-bg: #ecfdf3;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--ink); }
  .es-page { min-height: 100vh; padding: 28px; position: relative; overflow-x: hidden; }
  .bg-blob { position: fixed; border-radius: 50%; background: radial-gradient(circle, rgba(109,94,248,0.12), transparent 70%); z-index: 0; }
  .bg-blob.left { width: 420px; height: 420px; top: 30%; left: -200px; }
  .bg-blob.right { width: 420px; height: 420px; bottom: 0; right: -200px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; max-width: 1040px; margin: 0 auto 28px; position: relative; z-index: 1; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { height: 44px; }
  .brand-text h2 { margin: 0; font-size: 18px; font-weight: 700; }
  .brand-text p { margin: 0; font-size: 12.5px; color: var(--muted); }
  .trust-badge { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 8px 16px; font-size: 12.5px; box-shadow: 0 2px 10px rgba(80,60,200,0.05); }
  .trust-badge .dot { width: 26px; height: 26px; background: var(--green-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--green); font-size: 14px; }
  .trust-badge strong { display: block; color: var(--green); }
  .trust-badge span { color: var(--muted); }
  .topbar-actions { display: flex; align-items: center; gap: 10px; }
  .credit-widget { min-width: 190px; background: #fff; border: 1px solid #ddd8ff; border-radius: 12px; padding: 9px 12px; box-shadow: 0 5px 18px rgba(80,60,200,0.08); }
  .credit-widget-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
  .credit-widget-title { display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: var(--ink); }
  .credit-widget-title .credit-icon { width: 24px; height: 24px; border-radius: 7px; background: #eeecfd; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .credit-widget .credit-count { font-size: 12px; font-weight: 700; color: var(--accent-text); white-space: nowrap; }
  .credit-widget .progress-bar-bg { height: 5px; margin-top: 0; }
  .credit-widget .credit-plan { display: block; margin-top: 5px; font-size: 10.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .layout { max-width: 1040px; margin: 0 auto; display: flex; gap: 24px; align-items: flex-start; position: relative; z-index: 1; }
  .card-wrap { flex: 1; min-width: 0; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 40px 40px 36px; box-shadow: 0 12px 40px rgba(80,60,200,0.08); position: relative; }
  .card-wrap::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 18px 18px 0 0; background: linear-gradient(90deg, var(--accent1), var(--accent2)); }
  .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--green); background: var(--green-bg); padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
  .head-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
  .g-icon { width: 48px; height: 48px; border-radius: 12px; background: #eeecfd; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  h1 { font-size: 23px; font-weight: 700; margin: 0; }
  p.lead { color: var(--muted); font-size: 14.5px; line-height: 1.6; margin: 12px 0 20px; }
  p.lead code { background: #eeecfd; color: var(--accent-text); padding: 1px 7px; border-radius: 5px; font-size: 13px; }
  label { display: flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600; margin-bottom: 8px; margin-top: 20px; }
  label:first-of-type { margin-top: 0; }
  input[type="text"], input[type="number"] { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; background: #faf9ff; }
  input:focus, textarea:focus { outline: none; border-color: var(--accent1); background: #fff; }
  .to-row { display: flex; align-items: center; justify-content: space-between; }
  .cc-bcc-toggle { font-size: 12.5px; color: var(--accent-text); font-weight: 600; cursor: pointer; user-select: none; }
  .hint-inline { font-weight: 400; color: var(--muted); font-size: 11.5px; }
  .editor-toolbar { display: flex; flex-wrap: nowrap; align-items: center; gap: 6px; background: #fafaff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; box-shadow: 0 4px 14px rgba(80,60,200,0.05); overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #9b98a5 transparent; }
  .editor-toolbar::-webkit-scrollbar { height: 7px; }
  .editor-toolbar::-webkit-scrollbar-track { background: transparent; }
  .editor-toolbar::-webkit-scrollbar-thumb { background: #9b98a5; border-radius: 999px; }
  .editor-toolbar button, .editor-toolbar select, .editor-toolbar .swatch-wrap { flex: 0 0 auto; }
  .editor-toolbar button { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; font-size: 13px; cursor: pointer; color: var(--ink); display: flex; align-items: center; justify-content: center; min-width: 38px; height: 38px; transition: background 0.15s; }
  .editor-toolbar button:hover { background: #eeecfd; }
  .editor-toolbar select, .editor-toolbar .swatch-wrap { border: 1px solid var(--line); border-radius: 8px; font-size: 13px; background: #fff; height: 38px; display: flex; align-items: center; }
  .editor-toolbar select { padding: 0 8px; cursor: pointer; }
  .editor-toolbar .swatch-wrap { padding: 0 8px; gap: 6px; cursor: pointer; }
  .editor-toolbar input[type="color"] { width: 20px; height: 20px; border: none; padding: 0; cursor: pointer; border-radius: 4px; background: none; }
  .editor-toolbar .chevron { font-size: 9px; color: var(--muted); }
  .tb-sep { width: 1px; height: 24px; background: var(--line); margin: 0 4px; }
  .rich-editor { width: 100%; min-height: 180px; padding: 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; line-height: 1.6; background: #faf9ff; overflow-y: auto; }
  .rich-editor:focus { outline: none; border-color: var(--accent1); background: #fff; }
  .rich-editor:empty::before { content: attr(data-placeholder); color: #9ca3af; }
  .rich-editor .email-shape { position: relative; cursor: pointer; border-radius: 8px; transition: outline-color .12s ease; outline: 2px solid transparent; outline-offset: 3px; }
  .rich-editor .email-shape:hover { outline-color: #d8d4fb; }
  .rich-editor .email-shape.shape-selected { outline-color: var(--accent1); }
  .rich-editor .email-shape [contenteditable="true"]:focus { outline: none; }
  .shape-toolbar { position: absolute; z-index: 50; display: flex; align-items: center; gap: 4px; background: #1e1b3a; border-radius: 10px; padding: 6px; box-shadow: 0 8px 24px rgba(20,15,50,0.28); }
  .shape-toolbar button, .shape-toolbar .shape-tb-swatch { background: transparent; border: none; color: #fff; font-size: 13px; padding: 6px 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; }
  .shape-toolbar button:hover { background: rgba(255,255,255,0.14); }
  .shape-toolbar .shape-tb-swatch input[type="color"] { width: 18px; height: 18px; border: none; padding: 0; background: none; cursor: pointer; }
  .shape-toolbar .shape-tb-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
  .shape-toolbar select { background: #2c2856; color: #fff; border: none; border-radius: 6px; font-size: 12.5px; padding: 5px 6px; }
  .insert-shape-btn { display: flex; align-items: center; gap: 5px; }
  .dropzone { display: flex; align-items: center; gap: 20px; border: 2px dashed #c7c2f0; border-radius: 14px; background: #fafaff; padding: 14px 24px; cursor: pointer; }
  .dropzone.dragover { background: #f0eefe; border-color: var(--accent1); }
  .dropzone .choose-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; border-radius: 10px; padding: 12px 22px; font-size: 14.5px; font-weight: 600; cursor: pointer; flex-shrink: 0; }
  .dropzone .dz-divider { width: 1px; height: 34px; background: var(--line); flex-shrink: 0; }
  .dropzone .dz-text { flex: 1; }
  .dropzone .dz-text .dz-main { font-size: 15px; font-weight: 600; color: var(--ink); }
  .dropzone .dz-text .dz-sub { font-size: 12.5px; color: var(--muted); margin-top: 2px; }
  .dropzone .dz-cloud { font-size: 26px; color: #b7b3e8; flex-shrink: 0; }
  .dropzone input[type="file"] { display: none; }
  .attachment-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
  .attachment-item { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 16px; box-shadow: 0 2px 8px rgba(80,60,200,0.04); }
  .attachment-item .file-badge { width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(135deg, #8b8ff5, #6d5ef8); color: #fff; font-size: 18px; }
  .attachment-item .file-badge .ext-tag { position: absolute; bottom: -4px; right: -6px; background: #4c3fd7; color: #fff; font-size: 8.5px; font-weight: 700; padding: 1px 5px; border-radius: 5px; letter-spacing: 0.3px; }
  .attachment-item .file-info { flex: 1; min-width: 0; }
  .attachment-item .file-name { font-size: 14px; font-weight: 500; color: var(--ink); overflow-wrap: anywhere; }
  .attachment-item .file-size { font-size: 12.5px; color: var(--muted); margin-left: 6px; }
  .attachment-item .file-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .attachment-item .icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; background: #f1f0fb; color: var(--ink); }
  .attachment-item .icon-btn.remove-att { background: #fdeceb; color: #d5473a; }
  .row { display: flex; gap: 16px; }
  .row > div { flex: 1; }
  .hint { font-size: 12px; color: var(--muted); margin-top: 6px; }
  .submit-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px 20px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; border: none; border-radius: 10px; font-size: 15.5px; font-weight: 600; cursor: pointer; margin-top: 28px; box-shadow: 0 8px 20px rgba(109,94,248,0.3); }
  .submit-btn:disabled { background: #b7b3e8; box-shadow: none; cursor: not-allowed; }
  .stop-btn { display: block; width: 100%; padding: 12px 20px; background: #fff; color: #b3261e; border: 1px solid #f0c4c0; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 10px; }
  .stop-btn:disabled { color: #aaa; border-color: var(--line); cursor: not-allowed; }
  .status { margin-top: 20px; font-size: 14px; padding: 14px 16px; border-radius: 10px; display: none; }
  .status.visible { display: block; }
  .status.info { background: #eef2ff; color: var(--accent-text); }
  .status.success { background: var(--green-bg); color: var(--green); }
  .status.error { background: #fbeaea; color: #b3261e; }
  .progress-bar-bg { width: 100%; height: 8px; background: #eee; border-radius: 4px; margin-top: 10px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent1), var(--accent2)); width: 0%; transition: width 0.3s ease; }
  .privacy-line { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--muted); margin-top: 22px; }
  .sidebar { width: 260px; flex-shrink: 0; background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 22px; box-shadow: 0 12px 40px rgba(80,60,200,0.08); }
  .sidebar .ic-wrap { width: 40px; height: 40px; border-radius: 10px; background: #eeecfd; display: flex; align-items: center; justify-content: center; font-size: 17px; margin-bottom: 10px; }
  .sidebar h3 { font-size: 14.5px; margin: 0 0 4px; }
  .sidebar .quota-line { font-size: 12.5px; color: var(--muted); margin: 0 0 12px; }
  .sidebar .pct { font-size: 12px; color: var(--muted); text-align: right; }
  .brand-footer { max-width: 1040px; margin: 24px auto 0; display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); position: relative; z-index: 1; }
  .brand-footer b { color: var(--accent-text); }
  .privacy-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 999px; background: #fff; color: var(--accent-text); border: 1px solid #cfc9ff; text-decoration: none; font-size: 12.5px; font-weight: 700; box-shadow: 0 4px 14px rgba(109,94,248,0.12); transition: all .18s ease; }
  .privacy-btn:hover { background: #f5f3ff; border-color: var(--accent1); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(109,94,248,0.18); }

  @media (max-width: 800px) { .layout { flex-direction: column; } .sidebar { width: 100%; } .topbar { flex-direction: column; align-items: stretch; gap: 12px; } .topbar-actions { justify-content: stretch; } .credit-widget { flex: 1; } .trust-badge { flex: 1; } }
  .modal-overlay { position: fixed; inset: 0; background: rgba(20,15,50,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal-box { background: #fff; border-radius: 18px; max-width: 380px; width: 100%; padding: 32px 28px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
  .modal-box .modal-icon { width: 64px; height: 64px; border-radius: 50%; background: #fdf3e0; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 18px; }
  .modal-box h2 { font-size: 19px; margin: 0 0 10px; }
  .modal-box p { font-size: 14px; color: var(--muted); line-height: 1.6; margin: 0 0 24px; }
  .modal-box .modal-btn-primary { width: 100%; padding: 13px; border: none; border-radius: 10px; background: linear-gradient(90deg, var(--accent1), var(--accent2)); color: #fff; font-weight: 600; font-size: 14.5px; cursor: pointer; margin-bottom: 10px; }
  .modal-box .modal-btn-secondary { width: 100%; padding: 11px; border: 1px solid var(--line); border-radius: 10px; background: #fff; color: var(--muted); font-weight: 600; font-size: 13.5px; cursor: pointer; }
  .save-tpl-box .modal-icon { background: #eeecfd; }
  .save-tpl-input { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; background: #faf9ff; margin-bottom: 6px; text-align: left; }
  .save-tpl-input:focus { outline: none; border-color: var(--accent1); background: #fff; }
  .save-tpl-error { color: #d5473a; font-size: 12.5px; margin: 0 0 14px; text-align: left; }
  .template-strip { display: flex; gap: 10px; width: 100%; overflow-x: auto; overflow-y: hidden; padding: 2px 0 10px; margin-bottom: 6px; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #9b98a5 transparent; }
  .template-strip::-webkit-scrollbar { height: 8px; }
  .template-strip::-webkit-scrollbar-track { background: transparent; }
  .template-strip::-webkit-scrollbar-thumb { background: #9b98a5; border-radius: 999px; }
  .template-strip::-webkit-scrollbar-thumb:hover { background: #777487; }
  .template-card { position: relative; flex: 0 0 108px; width: 108px; height: 90px; min-height: 90px; box-sizing: border-box; border: 1px solid #dfdded; border-radius: 12px; background: #faf9ff; padding: 9px 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #29264b; cursor: pointer; transition: transform .18s ease, border-color .18s ease, background-color .18s ease, box-shadow .18s ease; }
  .template-card:hover { transform: translateY(-2px); border-color: #b9b3f5; background: #f7f5ff; box-shadow: 0 6px 15px rgba(75,63,170,.10); }
  .template-card.active { border: 2px solid var(--accent1); background: #efedff; box-shadow: 0 5px 14px rgba(75,63,170,.10); }
  .template-card.locked { opacity: .6; background: #f3f2f8; }
  .template-card.locked:hover { border-color: #dfdded; box-shadow: none; }
  .template-card .t-lock { position: absolute; top: 5px; right: 6px; font-size: 11px; line-height: 1; }
  .template-card .t-icon { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; margin-bottom: 7px; color: #29264b; }
  .template-card .t-icon svg { width: 24px; height: 24px; display: block; }
  .template-card .t-name { font-size: 11.5px; line-height: 1.3; font-weight: 600; color: var(--ink); white-space: normal; }
  .template-card:focus-visible { outline: 2px solid var(--accent1); outline-offset: 2px; }
  @media (max-width: 700px) { .template-card { flex-basis: 100px; width: 100px; height: 88px; } }
`;

const EXT_COLORS = {
  jpg: 'linear-gradient(135deg, #8b8ff5, #6d5ef8)', jpeg: 'linear-gradient(135deg, #8b8ff5, #6d5ef8)',
  png: 'linear-gradient(135deg, #34d399, #10b981)', pdf: 'linear-gradient(135deg, #f87171, #dc2626)',
  doc: 'linear-gradient(135deg, #60a5fa, #2563eb)', docx: 'linear-gradient(135deg, #60a5fa, #2563eb)',
  xls: 'linear-gradient(135deg, #4ade80, #16a34a)', xlsx: 'linear-gradient(135deg, #4ade80, #16a34a)',
  csv: 'linear-gradient(135deg, #4ade80, #16a34a)', zip: 'linear-gradient(135deg, #fbbf24, #d97706)',
};

export default function Campaign() {
  const router = useRouter();
  const emailRef = useRef(null);
  const attachedFilesRef = useRef([]);
  const [showOutOfCredits, setShowOutOfCredits] = useState(false);
  const [outOfCreditsMsg, setOutOfCreditsMsg] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('blank');
  const [customTemplates, setCustomTemplates] = useState([]);
  const [templatesLocked, setTemplatesLocked] = useState(false);

  // Custom templates now live on the server, keyed to the signed-in
  // account's session cookie (see pages/api/templates.js) — so a saved
  // template is private to whoever created it and follows them across
  // devices, instead of sitting in that one browser's localStorage where
  // anyone using the same machine could see or edit it.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/templates', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.templates)) setCustomTemplates(data.templates);
      } catch (err) { /* ignore — falls back to the built-in templates only */ }
    })();
  }, []);

  function pickTemplate(t, locked) {
    if (locked && t.id !== 'blank') {
      window.location.href = '/upgrade';
      return;
    }
    setActiveTemplate(t.id);
    if (subjectRef.current) subjectRef.current.value = t.subject;
    if (bodyEditorRef.current) bodyEditorRef.current.innerHTML = t.bodyHtml;
  }

  // --- Save-as-template modal (replaces the old browser prompt()) ---
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState('');
  const [saveTemplateError, setSaveTemplateError] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  function handleSaveTemplate() {
    const subject = subjectRef.current?.value || '';
    const bodyHtml = bodyEditorRef.current?.innerHTML || '';
    if (!subject.trim() && !bodyHtml.trim()) {
      alert('Write a subject or body first, then save it as a template.');
      return;
    }
    setSaveTemplateName('');
    setSaveTemplateError('');
    setShowSaveModal(true);
  }

  async function confirmSaveTemplate() {
    const name = saveTemplateName.trim();
    if (!name) {
      setSaveTemplateError('Give your template a name.');
      return;
    }
    const subject = subjectRef.current?.value || '';
    const bodyHtml = bodyEditorRef.current?.innerHTML || '';

    setSavingTemplate(true);
    setSaveTemplateError('');
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, bodyHtml }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save the template.');
      setCustomTemplates((prev) => [...prev, data.template]);
      setActiveTemplate(data.template.id);
      setShowSaveModal(false);
    } catch (err) {
      setSaveTemplateError(err.message || 'Could not save the template.');
    } finally {
      setSavingTemplate(false);
    }
  }

  // --- Set-link modal (replaces the old browser prompt() dialogs used by
  // the "insert link" toolbar button and the button/image shape toolbars) ---
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkModalTitle, setLinkModalTitle] = useState('Insert link');
  const [linkModalIcon, setLinkModalIcon] = useState('🔗');
  const [linkModalPlaceholder, setLinkModalPlaceholder] = useState('https://example.com');
  const [linkModalValue, setLinkModalValue] = useState('');
  const [linkModalError, setLinkModalError] = useState('');
  const linkModalOnConfirmRef = useRef(null);

  // Called from the vanilla-DOM editor code below (via openLinkModalRef,
  // since that effect only runs once and can't see fresh React state).
  function openLinkModal({ title, icon, placeholder, initialValue, onConfirm }) {
    setLinkModalTitle(title);
    setLinkModalIcon(icon || '🔗');
    setLinkModalPlaceholder(placeholder || 'https://example.com');
    setLinkModalValue(initialValue || '');
    setLinkModalError('');
    linkModalOnConfirmRef.current = onConfirm;
    setShowLinkModal(true);
  }
  const openLinkModalRef = useRef(openLinkModal);
  openLinkModalRef.current = openLinkModal;

  function confirmLinkModal() {
    const url = linkModalValue.trim();
    if (!url) {
      setLinkModalError('Enter a URL first.');
      return;
    }
    linkModalOnConfirmRef.current?.(url);
    setShowLinkModal(false);
  }

  async function handleDeleteTemplate(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this saved template?')) return;
    const prev = customTemplates;
    setCustomTemplates(prev.filter((t) => t.id !== id));
    if (activeTemplate === id) setActiveTemplate('blank');
    try {
      const res = await fetch(`/api/templates?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      // Roll back the optimistic removal if the server call failed.
      setCustomTemplates(prev);
      alert('Could not delete that template — please try again.');
    }
  }

  const statusRef = useRef(null);
  const progressWrapRef = useRef(null);
  const progressBarRef = useRef(null);
  const startBtnRef = useRef(null);
  const stopBtnRef = useRef(null);
  const quotaLineRef = useRef(null);
  const quotaBarRef = useRef(null);
  const quotaPctRef = useRef(null);
  const bodyEditorRef = useRef(null);
  const ccBccFieldsRef = useRef(null);
  const ccBccToggleRef = useRef(null);
  const dropzoneRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const attachmentListRef = useRef(null);
  const dzMainTextRef = useRef(null);
  const chooseFilesBtnRef = useRef(null);
  const subjectRef = useRef(null);
  const ccFieldRef = useRef(null);
  const bccFieldRef = useRef(null);
  const delayRef = useRef(null);
  const planLineRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;

    const statusEl = statusRef.current;
    const progressWrap = progressWrapRef.current;
    const progressBar = progressBarRef.current;
    const startBtn = startBtnRef.current;
    const stopBtn = stopBtnRef.current;
    const quotaLine = quotaLineRef.current;
    const quotaBar = quotaBarRef.current;
    const quotaPct = quotaPctRef.current;
    const bodyEditor = bodyEditorRef.current;

    function showStatus(text, type) {
      statusEl.textContent = text;
      statusEl.className = `status ${type} visible`;
    }

    (async () => {
      let email = null;
      try {
        const res = await fetch('/api/me', { credentials: 'same-origin' });
        const data = await res.json();
        if (data.loggedIn) email = data.email;
      } catch (err) { /* handled below */ }

      if (!email) {
        showStatus('Missing account info — please start over from the connect page.', 'error');
        return;
      }
      emailRef.current = email;
      initPage(email);
    })();

    function initPage(email) {

    function setRunningUI(running) {
      startBtn.disabled = running;
      startBtn.textContent = running ? 'Running...' : '✈️ Start Campaign →';
      stopBtn.style.display = running ? 'block' : 'none';
      stopBtn.disabled = false;
      stopBtn.textContent = 'Stop Campaign';
    }

    function updateQuotaUI(remaining, limit) {
      quotaLine.textContent = `${remaining} of ${limit} send credits left today.`;
      const usedPct = limit ? Math.round(((limit - remaining) / limit) * 100) : 0;
      quotaBar.style.width = usedPct + '%';
      quotaPct.textContent = usedPct + '% used';
    }

    async function loadQuota() {
      try {
        const res = await fetch(`/api/campaign-status?email=${encodeURIComponent(email)}`, { credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json();
          updateQuotaUI(data.remainingQuota, data.dailyLimit);
          if (data.running) {
            setRunningUI(true);
            // A campaign was already in progress before this reload — resume
            // polling so sent/failed counts and the progress bar keep updating
            // instead of sitting frozen until a brand-new campaign is started.
            pollStatus();
          } else if (data.total) {
            // No campaign running right now, but we have a finished one from
            // earlier today — show its final numbers instead of a blank state.
            const donePart = data.sent + data.failed;
            const pct = data.total ? Math.round((donePart / data.total) * 100) : 0;
            progressWrap.style.display = 'block';
            progressBar.style.width = pct + '%';
            const stoppedNote = data.stoppedEarly ? ' Stopped early by request.' : '';
            const skippedNote = data.skippedByQuota ? ` ${data.skippedByQuota} skipped due to today's send limit.` : '';
            showStatus(`Campaign finished. ${data.sent} sent, ${data.failed} failed out of ${data.total}.${stoppedNote}${skippedNote}`, data.failed > 0 ? 'error' : 'success');
          }
        } else {
          quotaLine.textContent = 'No campaigns run yet today.';
        }
      } catch (err) { /* fine */ }
    }
    loadQuota();

    async function loadPlan() {
      try {
        const res = await fetch('/api/plan-status', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = await res.json();
        const planName = data.plans[data.currentPlan]?.name || data.currentPlan;
        const trialNote = data.currentPlan === 'free'
          ? (data.trialExpired ? ' · Trial ended' : ` · Trial: ${data.trialDaysLeft} day${data.trialDaysLeft === 1 ? '' : 's'} left`)
          : '';
        planLineRef.current.textContent = `Plan: ${planName}${trialNote}`;
        applyFeatureLocks(data.features);
        setTemplatesLocked(!data.features.templateDesigns);
      } catch (err) { /* fine */ }
    }
    loadPlan();

    function applyFeatureLocks(features) {
      if (!features.ccBcc) {
        const toggle = ccBccToggleRef.current;
        toggle.textContent = 'Cc/Bcc 🔒 Pro';
        toggle.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          window.location.href = '/upgrade';
        }, true);
      }
      if (!features.attachments) {
        const dz = dropzoneRef.current;
        dz.style.opacity = '0.6';
        dz.style.cursor = 'not-allowed';
        dzMainTextRef.current.textContent = '🔒 Attachments are a Pro feature';
        chooseFilesBtnRef.current.textContent = '⭐ Upgrade to attach files';
        chooseFilesBtnRef.current.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          window.location.href = '/upgrade';
        }, true);
        dz.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
          window.location.href = '/upgrade';
        }, true);
      }
    }

    async function pollStatus() {
      try {
        const res = await fetch(`/api/campaign-status?email=${encodeURIComponent(email)}`, { credentials: 'same-origin' });
        const data = await res.json();
        if (!res.ok) return;

        updateQuotaUI(data.remainingQuota, data.dailyLimit);

        const donePart = data.sent + data.failed;
        const pct = data.total ? Math.round((donePart / data.total) * 100) : 0;
        progressWrap.style.display = 'block';
        progressBar.style.width = pct + '%';

        if (data.running) {
          showStatus(`Sending... ${donePart} of ${data.total} processed (${data.sent} sent, ${data.failed} failed).`, 'info');
          setTimeout(pollStatus, 3000);
        } else {
          const stoppedNote = data.stoppedEarly ? ' Stopped early by request.' : '';
          const skippedNote = data.skippedByQuota ? ` ${data.skippedByQuota} skipped due to today's send limit.` : '';
          showStatus(`Campaign finished. ${data.sent} sent, ${data.failed} failed out of ${data.total}.${stoppedNote}${skippedNote}`, data.failed > 0 ? 'error' : 'success');
          setRunningUI(false);
        }
      } catch (err) {
        setTimeout(pollStatus, 3000);
      }
    }

    const toolbarButtons = document.querySelectorAll('#editor-toolbar button[data-cmd]');
    toolbarButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        bodyEditor.focus();
        document.execCommand(btn.dataset.cmd, false, null);
      });
    });
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    fontSizeSelect.addEventListener('change', (e) => {
      bodyEditor.focus();
      document.execCommand('fontSize', false, e.target.value);
    });
    const textColor = document.getElementById('textColor');
    textColor.addEventListener('input', (e) => {
      bodyEditor.focus();
      document.execCommand('foreColor', false, e.target.value);
    });
    const highlightColor = document.getElementById('highlightColor');
    highlightColor.addEventListener('input', (e) => {
      bodyEditor.focus();
      // hiliteColor isn't supported in every browser (notably older Safari) —
      // backColor is the more broadly-supported equivalent.
      if (!document.execCommand('hiliteColor', false, e.target.value)) {
        document.execCommand('backColor', false, e.target.value);
      }
    });
    const clearHighlightBtn = document.getElementById('clearHighlightBtn');
    clearHighlightBtn.addEventListener('click', () => {
      bodyEditor.focus();
      if (!document.execCommand('hiliteColor', false, 'transparent')) {
        document.execCommand('backColor', false, 'transparent');
      }
    });
    const insertLinkBtn = document.getElementById('insertLinkBtn');
    let savedSelectionRange = null;
    insertLinkBtn.addEventListener('click', () => {
      // Save the current text selection so it survives the modal opening
      // (clicking into the modal's input moves focus, which clears it).
      const sel = window.getSelection();
      savedSelectionRange = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      openLinkModalRef.current({
        title: 'Insert link',
        icon: '🔗',
        placeholder: 'https://example.com',
        initialValue: '',
        onConfirm: (url) => {
          bodyEditor.focus();
          if (savedSelectionRange) {
            const sel2 = window.getSelection();
            sel2.removeAllRanges();
            sel2.addRange(savedSelectionRange);
          }
          document.execCommand('createLink', false, url);
        },
      });
    });

    // --- Editable "shapes": button / box / divider / spacer / image blocks ---
    // Each shape is a small self-contained widget dropped into the rich
    // editor. The outer wrapper is contenteditable="false" so clicking it
    // selects the whole shape (rather than dropping the text cursor inside
    // it), while any inner element marked contenteditable="true" stays
    // independently editable — the standard "editable island" pattern.
    const SHAPE_HTML = {
      button: () => `<div class="email-shape shape-button" contenteditable="false" data-shape="button" data-href="#" style="text-align:center;margin:16px 0;"><a href="#" contenteditable="true" style="display:inline-block;background:#6d5ef8;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 32px;border-radius:8px;">Click Here</a></div>`,
      box: () => `<div class="email-shape shape-box" contenteditable="false" data-shape="box" style="margin:16px 0;"><div contenteditable="true" style="background:#f7f6ff;border:1px solid #e9e6ff;border-radius:10px;padding:18px;font-size:14px;color:#333;line-height:1.6;">Edit this box's text…</div></div>`,
      divider: () => `<div class="email-shape shape-divider" contenteditable="false" data-shape="divider" style="margin:20px 0;padding:8px 0;"><hr style="border:none;border-top:2px solid #6d5ef8;margin:0;" /></div>`,
      spacer: () => `<div class="email-shape shape-spacer" contenteditable="false" data-shape="spacer" data-size="medium" style="height:32px;"></div>`,
      image: () => `<div class="email-shape shape-image" contenteditable="false" data-shape="image" style="text-align:center;margin:16px 0;"><img src="https://placehold.co/560x200?text=Click+to+set+image+URL" style="max-width:100%;border-radius:8px;" /></div>`,
    };
    document.querySelectorAll('.insert-shape-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        bodyEditor.focus();
        const build = SHAPE_HTML[btn.dataset.shape];
        if (!build) return;
        // Wrap with zero-width spaces so the cursor always has somewhere to
        // land right after the shape, even if it was inserted at the end.
        document.execCommand('insertHTML', false, build() + '<p><br></p>');
      });
    });

    let selectedShape = null;
    const shapeToolbar = document.createElement('div');
    shapeToolbar.className = 'shape-toolbar';
    shapeToolbar.style.display = 'none';
    document.body.appendChild(shapeToolbar);

    function hideShapeToolbar() {
      shapeToolbar.style.display = 'none';
      if (selectedShape) selectedShape.classList.remove('shape-selected');
      selectedShape = null;
    }

    function positionShapeToolbar(shapeEl) {
      const rect = shapeEl.getBoundingClientRect();
      shapeToolbar.style.top = `${window.scrollY + rect.top - 44}px`;
      shapeToolbar.style.left = `${window.scrollX + rect.left}px`;
      shapeToolbar.style.display = 'flex';
    }

    function selectShape(shapeEl) {
      if (selectedShape) selectedShape.classList.remove('shape-selected');
      selectedShape = shapeEl;
      selectedShape.classList.add('shape-selected');

      const type = shapeEl.dataset.shape;
      let controls = '';
      if (type === 'button' || type === 'box') {
        const target = type === 'button' ? shapeEl.querySelector('a') : shapeEl.querySelector('div');
        const currentColor = target ? rgbToHex(target.style.backgroundColor) : '#6d5ef8';
        controls += `<label class="shape-tb-swatch" title="Background color">🎨<input type="color" id="shapeColorInput" value="${currentColor}" /></label><span class="shape-tb-sep"></span>`;
      }
      if (type === 'divider') {
        const hr = shapeEl.querySelector('hr');
        const currentColor = hr ? rgbToHex(hr.style.borderTopColor) : '#6d5ef8';
        controls += `<label class="shape-tb-swatch" title="Divider color">🎨<input type="color" id="shapeColorInput" value="${currentColor}" /></label><span class="shape-tb-sep"></span>`;
      }
      if (type === 'button') {
        controls += `<button type="button" id="shapeLinkBtn" title="Set link">🔗 Link</button><span class="shape-tb-sep"></span>`;
      }
      if (type === 'image') {
        controls += `<button type="button" id="shapeLinkBtn" title="Set image URL">🖼 Image URL</button><span class="shape-tb-sep"></span>`;
      }
      if (type === 'spacer') {
        controls += `<select id="shapeSizeSelect">
          <option value="small" ${shapeEl.dataset.size === 'small' ? 'selected' : ''}>Small</option>
          <option value="medium" ${(!shapeEl.dataset.size || shapeEl.dataset.size === 'medium') ? 'selected' : ''}>Medium</option>
          <option value="large" ${shapeEl.dataset.size === 'large' ? 'selected' : ''}>Large</option>
        </select><span class="shape-tb-sep"></span>`;
      }
      controls += `<button type="button" id="shapeDeleteBtn" title="Delete">🗑 Delete</button>`;
      shapeToolbar.innerHTML = controls;
      positionShapeToolbar(shapeEl);

      const colorInput = document.getElementById('shapeColorInput');
      if (colorInput) {
        colorInput.addEventListener('input', (e) => {
          if (type === 'button') shapeEl.querySelector('a').style.background = e.target.value;
          if (type === 'box') shapeEl.querySelector('div').style.background = e.target.value;
          if (type === 'divider') shapeEl.querySelector('hr').style.borderTopColor = e.target.value;
        });
      }
      const linkBtn = document.getElementById('shapeLinkBtn');
      if (linkBtn) {
        linkBtn.addEventListener('click', () => {
          if (type === 'button') {
            const a = shapeEl.querySelector('a');
            openLinkModalRef.current({
              title: 'Set button link',
              icon: '🔗',
              placeholder: 'https://example.com',
              initialValue: a.getAttribute('href') || '',
              onConfirm: (url) => a.setAttribute('href', url),
            });
          } else if (type === 'image') {
            const img = shapeEl.querySelector('img');
            openLinkModalRef.current({
              title: 'Set image URL',
              icon: '🖼️',
              placeholder: 'https://example.com/image.jpg',
              initialValue: img.getAttribute('src') || '',
              onConfirm: (url) => img.setAttribute('src', url),
            });
          }
        });
      }
      const sizeSelect = document.getElementById('shapeSizeSelect');
      if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
          const heights = { small: 16, medium: 32, large: 64 };
          shapeEl.dataset.size = e.target.value;
          shapeEl.style.height = `${heights[e.target.value]}px`;
          positionShapeToolbar(shapeEl);
        });
      }
      document.getElementById('shapeDeleteBtn').addEventListener('click', () => {
        shapeEl.remove();
        hideShapeToolbar();
      });
    }

    function rgbToHex(rgb) {
      if (!rgb) return '#6d5ef8';
      const m = rgb.match(/\d+/g);
      if (!m) return rgb.startsWith('#') ? rgb : '#6d5ef8';
      return '#' + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
    }

    bodyEditor.addEventListener('click', (e) => {
      const shapeEl = e.target.closest('.email-shape');
      if (shapeEl) {
        selectShape(shapeEl);
      } else {
        hideShapeToolbar();
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.shape-toolbar') && !e.target.closest('.email-shape')) hideShapeToolbar();
    });
    window.addEventListener('scroll', () => { if (selectedShape) positionShapeToolbar(selectedShape); }, true);

    ccBccToggleRef.current.addEventListener('click', () => {
      const fields = ccBccFieldsRef.current;
      fields.style.display = fields.style.display === 'none' ? 'block' : 'none';
    });

    function renderAttachmentList() {
      const wrap = attachmentListRef.current;
      wrap.innerHTML = attachedFilesRef.current.map((f, i) => {
        const ext = (f.filename.split('.').pop() || 'file').toLowerCase();
        const bg = EXT_COLORS[ext] || 'linear-gradient(135deg, #9ca3af, #6b7280)';
        return `
        <div class="attachment-item">
          <div class="file-badge" style="background:${bg};">🖼️<span class="ext-tag">${ext.toUpperCase()}</span></div>
          <div class="file-info"><span class="file-name">${f.filename}</span><span class="file-size">(${f.sizeLabel})</span></div>
          <div class="file-actions">
            <button type="button" class="icon-btn download-att" data-i="${i}" title="Download">⬇️</button>
            <button type="button" class="icon-btn remove-att" data-i="${i}" title="Remove">🗑️</button>
          </div>
        </div>`;
      }).join('');
      wrap.querySelectorAll('.remove-att').forEach((el) => {
        el.addEventListener('click', () => {
          attachedFilesRef.current.splice(parseInt(el.dataset.i, 10), 1);
          renderAttachmentList();
          updateDropzoneText();
        });
      });
      wrap.querySelectorAll('.download-att').forEach((el) => {
        el.addEventListener('click', () => {
          const f = attachedFilesRef.current[parseInt(el.dataset.i, 10)];
          const link = document.createElement('a');
          link.href = `data:${f.mimeType};base64,${f.dataBase64}`;
          link.download = f.filename;
          link.click();
        });
      });
    }

    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    const IMAGE_EXTENSIONS = new Set(['png','jpg','jpeg','gif','webp','svg','avif','bmp','ico','tif','tiff']);

    function isSupportedImage(file) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      return (file.type && file.type.startsWith('image/')) || IMAGE_EXTENSIONS.has(ext);
    }

    async function addFiles(fileList) {
      for (const file of fileList) {
        if (!isSupportedImage(file)) {
          showStatus(`Unsupported file: ${file.name}. Please choose an image (PNG, JPG, JPEG, GIF, WEBP, SVG, AVIF, BMP, ICO, TIF or TIFF).`, 'error');
          continue;
        }
        try {
          const dataBase64 = await fileToBase64(file);
          attachedFilesRef.current.push({
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            dataBase64,
            sizeLabel: formatBytes(file.size),
          });
        } catch (err) {
          console.error('Failed to read file:', file.name, err);
        }
      }
      renderAttachmentList();
      updateDropzoneText();
    }

    function updateDropzoneText() {
      const el = dzMainTextRef.current;
      const n = attachedFilesRef.current.length;
      el.textContent = n === 0 ? 'No file chosen' : `${n} file${n > 1 ? 's' : ''} chosen`;
    }

    const dropzone = dropzoneRef.current;
    const attachmentInput = attachmentInputRef.current;

    chooseFilesBtnRef.current.addEventListener('click', () => attachmentInput.click());
    attachmentInput.addEventListener('change', async (e) => {
      await addFiles(e.target.files);
      e.target.value = '';
    });
    ['dragenter', 'dragover'].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); });
    });
    dropzone.addEventListener('drop', async (e) => {
      if (e.dataTransfer?.files?.length) await addFiles(e.dataTransfer.files);
    });

    document.getElementById('campaign-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const subjectTemplate = subjectRef.current.value;
      const bodyTemplate = bodyEditor.innerHTML;
      if (!bodyEditor.textContent.trim()) {
        showStatus('Please write an email body before starting.', 'error');
        return;
      }
      const cc = ccFieldRef.current.value.trim();
      const bcc = bccFieldRef.current.value.trim();
      const delaySeconds = parseInt(delayRef.current.value, 10) || 30;

      setRunningUI(true);
      showStatus('Starting campaign...', 'info');

      try {
        const res = await fetch('/api/run-campaign', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email, subjectTemplate, bodyTemplate, delaySeconds,
            cc: cc || undefined, bcc: bcc || undefined,
            attachments: attachedFilesRef.current.map(({ filename, mimeType, dataBase64 }) => ({ filename, mimeType, dataBase64 })),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.code === 'OUT_OF_CREDITS') {
            setOutOfCreditsMsg(data.error);
            setShowOutOfCredits(true);
            statusEl.className = 'status';
            setRunningUI(false);
            return;
          }
          throw new Error(data.error || 'Something went wrong');
        }
        showStatus(data.message, 'info');
        pollStatus();
      } catch (err) {
        showStatus(err.message, 'error');
        setRunningUI(false);
      }
    });

    stopBtn.addEventListener('click', async () => {
      stopBtn.disabled = true;
      stopBtn.textContent = 'Stopping...';
      try {
        const res = await fetch('/api/stop-campaign', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Could not stop the campaign');
        showStatus('Stopping after the current email...', 'info');
      } catch (err) {
        showStatus(err.message, 'error');
        stopBtn.disabled = false;
        stopBtn.textContent = 'Stop Campaign';
      }
    });
    } // end initPage
  }, [router.isReady]);

  async function handleSwitchAccount(e) {
    e.preventDefault();
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = '/';
  }

  return (
    <>
      <Head><title>Compose your campaign</title></Head>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <div className="es-page">
        <div className="bg-blob left"></div>
        <div className="bg-blob right"></div>

        <div className="topbar">
          <div className="brand">
            <img src="/assets/logo.png" alt="Email Sender" />
            <div className="brand-text"><h2>Email Sender</h2><p>Smart Email Automation</p></div>
          </div>
          <div className="topbar-actions">
            <div className="credit-widget">
              <div className="credit-widget-head">
                <div className="credit-widget-title"><span className="credit-icon">⚡</span>Send Credits</div>
                <span className="credit-count" ref={quotaLineRef}>Loading…</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" ref={quotaBarRef} style={{ width: '0%' }}></div></div>
              <span className="credit-plan" ref={planLineRef}></span>
            </div>
            <div className="trust-badge">
              <span className="dot">🛡️</span>
              <div><strong>Secure &amp; Private</strong><span>Your data is always safe</span></div>
            </div>
          </div>
        </div>

        <div className="layout">
          <div className="card-wrap">
            <span className="badge">✓ Sheet connected</span>
            <div className="head-row">
              <span className="g-icon">✏️</span>
              <h1>Compose your campaign</h1>
            </div>
            <p className="lead">Write the subject and email body below. Use <code>{'{{name}}'}</code>, <code>{'{{company}}'}</code>, or any other column header from your sheet as a placeholder — it'll be swapped in automatically for each recipient.</p>

            <form id="campaign-form">
              <div className="to-row" style={{ marginTop: 0 }}>
                <label style={{ margin: 0 }}>🎨 Start from a template</label>
                <span className="cc-bcc-toggle" onClick={handleSaveTemplate}>💾 Save as template</span>
              </div>
              <div className="template-strip">
                {EMAIL_TEMPLATES.map((t, index) => {
                  const icons = [
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3.5h8l4 4V20.5H6V3.5Z" stroke="currentColor" strokeWidth="1.6"/><path d="M14 3.5v4h4M8.5 11h7M8.5 14h7M8.5 17h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13.2 2.8 6.5 13h5l-.7 8.2L17.5 11h-5l.7-8.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 20 8.5 15.5M9 15l5.8-5.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M14.2 4.2c2.4-.9 4.3-.4 5.6.9 1.3 1.3 1.8 3.2.9 5.6l-5.3 5.3-6.5-6.5 5.3-5.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="16.8" cy="7.2" r="1" fill="currentColor"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.5 7.5V5.8c0-.7.6-1.3 1.3-1.3h1.7l11.9 11.9-4.7 4.7L2.8 9.2l1.7-1.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="7.2" cy="7.2" r="1.1" stroke="currentColor" strokeWidth="1.3"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h8M8 11h8M8 14h5M8 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 13.5c-1.7-1.1-2.5-2.6-2.2-4.2.3-1.5 1.5-2.5 2.8-2.3 1 .2 1.7 1 1.9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9.5 11.5c-.4-1.7.1-3.1 1.3-3.7 1.2-.6 2.5.1 2.9 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13.5 11c-.1-1.5.6-2.6 1.8-2.8 1.2-.2 2.1.7 2.2 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7.2 13.5c.7 2.4 2.5 4.2 5.1 4.7 2.2.4 4.2-.6 4.9-2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="m8 12 2.2 2.2L16 8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 13.8 9l5.7.2-4.5 3.5 1.5 5.5-4.5-3.2-4.5 3.2 1.5-5.5-4.5-3.5L10.2 9 12 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="5.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 3.5v4M16 3.5v4M4.5 9.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 13.8 9l5.7 1-5.7 1.8L12 17.5l-1.8-5.7-5.7-1 5.7-1.8L12 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 5.5h14v10H9l-4 3v-13Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 17 17.5 4.5M12.5 4.5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ];

                  const isLocked = templatesLocked && t.id !== 'blank';
                  return (
                    <div
                      key={t.id}
                      className={`template-card ${activeTemplate === t.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                      onClick={() => pickTemplate(t, templatesLocked)}
                      role="button"
                      tabIndex={0}
                      title={isLocked ? 'Premium design — upgrade to Pro or Business to use it' : undefined}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          pickTemplate(t, templatesLocked);
                        }
                      }}
                    >
                      {isLocked && <span className="t-lock">🔒</span>}
                      <div className="t-icon">{icons[index] || icons[0]}</div>
                      <div className="t-name">{t.name}</div>
                    </div>
                  );
                })}
                {customTemplates.map((t) => (
                  <div
                    key={t.id}
                    className={`template-card ${activeTemplate === t.id ? 'active' : ''}`}
                    onClick={() => pickTemplate(t)}
                    role="button"
                    tabIndex={0}
                    style={{ position: 'relative' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        pickTemplate(t);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTemplate(t.id, e)}
                      title="Delete template"
                      style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, lineHeight: '16px', padding: 0, border: 'none', borderRadius: '50%', background: '#fdeceb', color: '#d5473a', fontSize: 11, cursor: 'pointer' }}
                    >✕</button>
                    <div className="t-icon">⭐</div>
                    <div className="t-name">{t.name}</div>
                  </div>
                ))}
              </div>

              <div className="to-row">
                <label style={{ margin: 0 }}>📧 Subject line</label>
                <span className="cc-bcc-toggle" ref={ccBccToggleRef}>Cc/Bcc</span>
              </div>
              <input type="text" id="subject" ref={subjectRef} placeholder="e.g. Quick question, {{name}}" required />

              <div id="cc-bcc-fields" ref={ccBccFieldsRef} style={{ display: 'none' }}>
                <label htmlFor="ccField">Cc <span className="hint-inline">(comma-separated, {'{{placeholders}}'} allowed)</span></label>
                <input type="text" id="ccField" ref={ccFieldRef} placeholder="cc@example.com" />
                <label htmlFor="bccField">Bcc <span className="hint-inline">(comma-separated, {'{{placeholders}}'} allowed)</span></label>
                <input type="text" id="bccField" ref={bccFieldRef} placeholder="bcc@example.com" />
              </div>

              <label htmlFor="body">✏️ Email body</label>
              <div className="editor-toolbar" id="editor-toolbar">
                <button type="button" data-cmd="bold" title="Bold"><b>B</b></button>
                <button type="button" data-cmd="italic" title="Italic"><i>I</i></button>
                <button type="button" data-cmd="underline" title="Underline"><u>U</u></button>
                <span className="tb-sep"></span>
                <select id="fontSizeSelect" title="Font size" defaultValue="3">
                  <option value="2">Small</option>
                  <option value="3">Normal</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>
                <label className="swatch-wrap" title="Text color">
                  🎨 <input type="color" id="textColor" defaultValue="#1e1b3a" />
                  <span className="chevron">▾</span>
                </label>
                <label className="swatch-wrap" title="Highlight color">
                  🖍️ <input type="color" id="highlightColor" defaultValue="#fff59d" />
                  <span className="chevron">▾</span>
                </label>
                <button type="button" id="clearHighlightBtn" title="Remove highlight">🚫🖍️</button>
                <span className="tb-sep"></span>
                <button type="button" data-cmd="insertUnorderedList" title="Bulleted list">☰</button>
                <button type="button" data-cmd="insertOrderedList" title="Numbered list">☰¹</button>
                <button type="button" data-cmd="justifyLeft" title="Align left">◀</button>
                <button type="button" data-cmd="justifyCenter" title="Align center">●</button>
                <span className="tb-sep"></span>
                <button type="button" id="insertLinkBtn" title="Insert link">🔗</button>
                <button type="button" data-cmd="removeFormat" title="Clear formatting">✕ Format <span className="chevron">▾</span></button>
                <span className="tb-sep"></span>
                <button type="button" className="insert-shape-btn" data-shape="button" title="Insert a button">🔲 Button</button>
                <button type="button" className="insert-shape-btn" data-shape="box" title="Insert a text box">▭ Box</button>
                <button type="button" className="insert-shape-btn" data-shape="divider" title="Insert a divider">➖ Divider</button>
                <button type="button" className="insert-shape-btn" data-shape="spacer" title="Insert a spacer">↕ Spacer</button>
                <button type="button" className="insert-shape-btn" data-shape="image" title="Insert an image">🖼 Image</button>
              </div>
              <div id="body" ref={bodyEditorRef} className="rich-editor" contentEditable="true" data-placeholder="Hi {{name}}, ..." suppressContentEditableWarning></div>
              <p className="hint-inline" style={{ marginTop: 10, marginBottom: 18 }}>Click any inserted shape to recolor, relink, resize, or delete it.</p>

              <label>📎 Attachments <span className="hint-inline">(sent with every email — max ~24MB total)</span></label>
              <div className="dropzone" id="dropzone" ref={dropzoneRef}>
                <button type="button" className="choose-btn" ref={chooseFilesBtnRef}>🖼️⬆ Choose Images</button>
                <div className="dz-divider"></div>
                <div className="dz-text">
                  <div className="dz-main" ref={dzMainTextRef}>No file chosen</div>
                  <div className="dz-sub">PNG, JPG, JPEG, GIF, WEBP, SVG, AVIF, BMP, ICO, TIF or TIFF</div>
                </div>
                <div className="dz-cloud">☁️</div>
                <input type="file" ref={attachmentInputRef} multiple accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/avif,image/bmp,image/x-icon,image/tiff,.png,.jpg,.jpeg,.gif,.webp,.svg,.avif,.bmp,.ico,.tif,.tiff" />
              </div>
              <div ref={attachmentListRef} className="attachment-list"></div>

              <div className="row">
                <div>
                  <label htmlFor="delay">🕒 Delay between emails (seconds)</label>
                  <input type="number" id="delay" ref={delayRef} defaultValue={30} min="5" required />
                  <p className="hint">Recommended: 20–60 seconds to keep your account safe.</p>
                </div>
              </div>

              <button type="submit" className="submit-btn" ref={startBtnRef}>✈️ Start Campaign →</button>
            </form>

            <button type="button" className="stop-btn" ref={stopBtnRef} style={{ display: 'none' }}>Stop Campaign</button>

            <div ref={statusRef} className="status"></div>
            <div className="progress-bar-bg" ref={progressWrapRef} style={{ display: 'none' }}>
              <div className="progress-bar-fill" ref={progressBarRef}></div>
            </div>

            <p className="privacy-line">🛡️ We respect your privacy. Your data is secure and never shared.</p>
            <p style={{ textAlign: 'center', marginTop: 12 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.location.href = '/connected'; }}
                className="button-link" style={{ marginTop: 0 }}
              >📊 Change spreadsheet</a>
            </p>
            <p style={{ textAlign: 'center', marginTop: 6 }}>
              <a href="#" onClick={handleSwitchAccount} className="button-link" style={{ marginTop: 0, color: '#6b7280' }}>Not you? Use a different account</a>
            </p>
          </div>

          <div className="sidebar">
            <div className="ic-wrap">⚙️</div>
            <h3>Campaign &amp; Account</h3>
            <p className="quota-line">Manage your connected account and plan.</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = '/upgrade'; }}
              className="button-link" style={{ display: 'flex', width: '100%', background: 'linear-gradient(90deg,#6d5ef8,#8b5cf6)', color: '#fff' }}
            >⭐ Upgrade Plan</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.href = '/profile'; }}
              className="button-link" style={{ display: 'flex', width: '100%', marginTop: 8, color: '#1e1b3a' }}
            >👤 My Profile</a>
          </div>
        </div>

        <div className="brand-footer">
          <span></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/privacy-policy" className="privacy-btn">🔒 Privacy Policy</a>
            <span>Powered by <b>VisionFlow</b> ✔️</span>
          </span>
        </div>
      </div>

      {showOutOfCredits && (
        <div className="modal-overlay" onClick={() => setShowOutOfCredits(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚡</div>
            <h2>Out of Credits</h2>
            <p>{outOfCreditsMsg || 'Upgrade your plan to keep sending campaigns.'}</p>
            <button
              className="modal-btn-primary"
              onClick={() => { window.location.href = '/upgrade'; }}
            >⭐ Upgrade your plan</button>
            <button className="modal-btn-secondary" onClick={() => setShowOutOfCredits(false)}>Not now</button>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal-overlay" onClick={() => !savingTemplate && setShowSaveModal(false)}>
          <div className="modal-box save-tpl-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">💾</div>
            <h2>Save as template</h2>
            <p>This template is saved to your account only — no one else can see or use it.</p>
            <input
              type="text"
              autoFocus
              className="save-tpl-input"
              placeholder="e.g. Monthly Newsletter"
              value={saveTemplateName}
              maxLength={60}
              onChange={(e) => { setSaveTemplateName(e.target.value); setSaveTemplateError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmSaveTemplate(); }}
            />
            {saveTemplateError && <p className="save-tpl-error">{saveTemplateError}</p>}
            <button className="modal-btn-primary" disabled={savingTemplate} onClick={confirmSaveTemplate}>
              {savingTemplate ? 'Saving…' : '💾 Save template'}
            </button>
            <button className="modal-btn-secondary" disabled={savingTemplate} onClick={() => setShowSaveModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          {/* Reuses save-tpl-box / save-tpl-input so this matches the other
              modals exactly — same icon background, input padding, and
              button styling instead of introducing a one-off look. */}
          <div className="modal-box save-tpl-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">{linkModalIcon}</div>
            <h2>{linkModalTitle}</h2>
            <p>Paste or type the destination URL, including https://</p>
            <input
              type="text"
              autoFocus
              className="save-tpl-input"
              placeholder={linkModalPlaceholder}
              value={linkModalValue}
              onChange={(e) => { setLinkModalValue(e.target.value); setLinkModalError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmLinkModal(); }}
            />
            {linkModalError && <p className="save-tpl-error">{linkModalError}</p>}
            <button className="modal-btn-primary" onClick={confirmLinkModal}>✓ Apply link</button>
            <button className="modal-btn-secondary" onClick={() => setShowLinkModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
