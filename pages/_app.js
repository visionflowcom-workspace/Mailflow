export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        button, .action-btn, .connect-btn, .submit-btn, .choose-btn, .privacy-btn, .button-link, .back-link, .skip-link, .source-tab, .tab-btn, .approve-btn, .reject-btn, .save-plan-btn, .del-user-btn, .modal-btn, .modal-btn-secondary {
          transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease, border-color .18s ease, color .18s ease, opacity .18s ease;
        }
        button:not(:disabled):hover, .action-btn:hover, .connect-btn:hover, .submit-btn:hover, .choose-btn:hover, .privacy-btn:hover, .button-link:hover, .back-link:hover, .skip-link:hover, .source-tab:hover, .tab-btn:hover, .approve-btn:hover, .reject-btn:hover, .save-plan-btn:hover, .del-user-btn:hover, .modal-btn:hover, .modal-btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 18px rgba(80, 60, 200, .16);
        }
        button:not(:disabled):active, .action-btn:active, .connect-btn:active, .submit-btn:active, .choose-btn:active, .privacy-btn:active, .button-link:active, .back-link:active, .skip-link:active, .source-tab:active, .tab-btn:active, .approve-btn:active, .reject-btn:active, .save-plan-btn:active, .del-user-btn:active, .modal-btn:active, .modal-btn-secondary:active {
          transform: translateY(0) scale(.98);
        }
        button:disabled { cursor: not-allowed; }
        .button-link {
          display: inline-flex !important; align-items: center; justify-content: center;
          min-height: 38px; padding: 9px 14px; border-radius: 10px;
          border: 1px solid #e6e4f7; background: #faf9ff; color: #4c3fd7 !important;
          font-size: 13px; font-weight: 600; text-decoration: none !important; cursor: pointer;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
