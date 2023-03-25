const { ipcRenderer } = window.require("electron");
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import channels from "../../shared/constants";
import "./editor.styles.scss";

export const Editor = () => {
  const params = useParams();
  const markdownHolder = useRef();
  const inputHolder = useRef();
  const [markup, setMarkup] = useState("");
  const [liveUpdates, setLiveUpdates] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    ipcRenderer.on(channels.CONVERT_MARKDOWN, (_event, arg) => {
      (markdownHolder.current as HTMLElement).innerHTML = arg;
    });
    ipcRenderer.on(channels.READ_FILE, (_event, arg) => {
      setMarkup(arg);
    });
    ipcRenderer.on(channels.SAVE_FILE, (_event, success) => {
      if (success) {
        setIsSaving(false);
      } else {
        console.error("error!");
      }
    });
    return () => {
      ipcRenderer.removeAllListeners(channels.CONVERT_MARKDOWN);
      ipcRenderer.removeAllListeners(channels.READ_FILE);
      ipcRenderer.removeAllListeners(channels.SAVE_FILE);
    };
  }, []);

  useEffect(() => {
    const { filename } = params;
    ipcRenderer.send(channels.READ_FILE, { filename });
  }, []);

  const convertToMarkdown = useCallback(async () => {
    ipcRenderer.send(channels.CONVERT_MARKDOWN, {
      markdown: markup,
    });
  }, [markup]);

  useEffect(() => {
    if (liveUpdates) {
      convertToMarkdown();
    }
  }, [liveUpdates, markup]);

  const saveFile = useCallback(() => {
    if (isSaving) return;
    ipcRenderer.send(channels.SAVE_FILE, {
      markdown: markup,
      filename: params.filename,
    });
    setIsSaving(true);
  }, [params, isSaving, markup]);

  return (
    <>
      <menu className="Controls">
        <h1 className="Controls__heading">{params.filename}</h1>
        <Link className="Controls__link" to="/">
          Home
        </Link>
        <input
          type="checkbox"
          name="live"
          id="live"
          checked={liveUpdates}
          onChange={() => {
            setLiveUpdates(!liveUpdates);
          }}
        />
        <label className="Controls__checkbox-label" htmlFor="live">
          Live updates
        </label>
        <button
          disabled={isSaving}
          onClick={saveFile}
          className="Controls__button"
        >
          {isSaving ? "saving..." : "save"}
        </button>
      </menu>
      <div className="Editor">
        <section className="Input">
          <textarea
            ref={inputHolder}
            name="input"
            id="input"
            cols={70}
            className="Input__text"
            value={markup}
            onInput={(e) => setMarkup((e.target as HTMLTextAreaElement).value)}
          ></textarea>
          <button onClick={convertToMarkdown} className="Input__button">
            Convert
          </button>
        </section>
        <section className="Preview">
          <div className="Preview__backing"></div>
          <span ref={markdownHolder} className="Preview__markdown"></span>
        </section>
      </div>
    </>
  );
};
