const apiUrl = `${import.meta.env.VITE_API_URL}/api/stories`;

import React, { useEffect, useState } from "react";
import { EditorContent, Extension, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import "./StoryEditor.css";

/* ==================================================
   INDENT EXTENSION
================================================== */

const Indent = Extension.create({
  name: "indent",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "blockquote"],

        attributes: {
          indent: {
            default: 0,

            parseHTML: (element) => {
              const value = element.getAttribute("data-indent");

              return value ? parseInt(value, 10) : 0;
            },

            renderHTML: (attributes) => {
              const indent = attributes.indent || 0;

              if (!indent) {
                return {};
              }

              return {
                "data-indent": indent,
                style: `margin-left: ${indent * 2}rem`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      increaseIndent:
        () =>
        ({ state, dispatch }) => {
          const { from, to } = state.selection;

          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (
              node.type.name === "paragraph" ||
              node.type.name === "heading" ||
              node.type.name === "blockquote"
            ) {
              const currentIndent = node.attrs.indent || 0;

              if (currentIndent < 6) {
                if (dispatch) {
                  const transaction = state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: currentIndent + 1,
                  });

                  dispatch(transaction);
                }

                changed = true;
              }
            }
          });

          return changed;
        },

      decreaseIndent:
        () =>
        ({ state, dispatch }) => {
          const { from, to } = state.selection;

          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (
              node.type.name === "paragraph" ||
              node.type.name === "heading" ||
              node.type.name === "blockquote"
            ) {
              const currentIndent = node.attrs.indent || 0;

              if (currentIndent > 0) {
                if (dispatch) {
                  const transaction = state.tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    indent: currentIndent - 1,
                  });

                  dispatch(transaction);
                }

                changed = true;
              }
            }
          });

          return changed;
        },
    };
  },
});

/* ==================================================
   STORY EDITOR
================================================== */

const StoryEditor = ({
  value = null,

  onChange,

  /*
   * Optional callback that runs AFTER
   * the backend request succeeds.
   */
  onSubmit,

  /*
   * Backend endpoint.
   *
   * Example:
   *
   * apiUrl="/api/stories"
   */


  /*
   * HTTP method.
   */
  method = "POST",

  submitLabel = "Submit Story",

  placeholder = "Start writing your story...",
}) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [showLinkInput, setShowLinkInput] = useState(false);

  const [showImageInput, setShowImageInput] = useState(false);

  /*
   * Submission state is managed internally.
   */
  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [submitSuccess, setSubmitSuccess] = useState("");

  /* ==================================================
     TIPTAP EDITOR
  ================================================== */

  const editor = useEditor({
    extensions: [
      StarterKit,

      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 100,
          minHeight: 100,
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Indent,

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value || {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    editorProps: {
      attributes: {
        class: "story-editor-content",
      },
    },

    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  /* ==================================================
     UPDATE CONTENT FROM PARENT
  ================================================== */

  useEffect(() => {
    if (!editor || !value) {
      return;
    }

    const current = editor.getJSON();

    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  /* ==================================================
     SUBMIT STORY
  ================================================== */

  const handleSubmit = async () => {
    if (!editor || submitting) {
      return;
    }

    /*
     * Reset previous messages.
     */
    setSubmitError("");
    setSubmitSuccess("");

    /*
     * Get TipTap JSON.
     */
    const content = editor.getJSON();

    /*
     * Get plain text.
     */
    const text = editor.getText().replace(/\s+/g, " ").trim();

    /*
     * Prevent empty submission.
     */
    if (!text) {
      setSubmitError("Please write something before submitting.");

      return;
    }

    /*
     * Build request payload.
     *
     * Change/add fields here if your backend
     * requires additional story properties.
     */
    const payload = {
      content,
      text,
    };

    try {
      setSubmitting(true);

      console.log("Submitting story to:", apiUrl);

      console.log("Story payload:", payload);

      const response = await fetch(apiUrl, {
        method,

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        /*
         * Sends cookies/session credentials.
         *
         * Remove this if your backend does not
         * use cookie authentication.
         */
        credentials: "include",

        body: JSON.stringify(payload),
      });

      /*
       * Read response body safely.
       */
      const responseText = await response.text();

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = {
            message: responseText,
          };
        }
      }

      /*
       * Handle backend errors.
       */
      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`,
        );
      }

      /*
       * Success.
       */
      setSubmitSuccess(data?.message || "Story submitted successfully.");

      /*
       * Optional callback.
       *
       * This receives the backend response,
       * NOT the editor content.
       */
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error("Story submission failed:", error);

      setSubmitError(
        error?.message || "Unable to submit story. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (!editor) {
    return <div className="story-editor-loading">Loading editor...</div>;
  }

  /* ==================================================
     TOOLBAR HELPERS
  ================================================== */

  const isActive = (name, attributes = {}) => editor.isActive(name, attributes);

  /* ==================================================
     LINK
  ================================================== */

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();

      setLinkUrl("");
      setShowLinkInput(false);

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: linkUrl.trim(),
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();

    setLinkUrl("");
    setShowLinkInput(false);
  };

  /* ==================================================
     IMAGE
  ================================================== */

  const addImage = () => {
    const url = imageUrl.trim();

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
        alt: "Story image",
      })
      .run();

    setImageUrl("");
    setShowImageInput(false);
  };

  /* ==================================================
     RENDER
  ================================================== */

  return (
    <div className="story-editor-wrapper">
      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="story-editor-toolbar">
        {/* History */}

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            ↶
          </button>

          <button
            type="button"
            className="toolbar-button"
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            ↷
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Headings */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("paragraph") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            P
          </button>

          {[1, 2, 3].map((level) => (
            <button
              key={level}
              type="button"
              className={`toolbar-button ${
                isActive("heading", { level }) ? "active" : ""
              }`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level,
                  })
                  .run()
              }
            >
              H{level}
            </button>
          ))}
        </div>

        <div className="toolbar-divider" />

        {/* Text Formatting */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button bold ${
              isActive("bold") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </button>

          <button
            type="button"
            className={`toolbar-button italic ${
              isActive("italic") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </button>

          <button
            type="button"
            className={`toolbar-button underline ${
              isActive("underline") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </button>

          <button
            type="button"
            className={`toolbar-button strike ${
              isActive("strike") ? "active" : ""
            }`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            S
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Alignment */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive({
                textAlign: "left",
              })
                ? "active"
                : ""
            }`}
            title="Align left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({
                textAlign: "center",
              })
                ? "active"
                : ""
            }`}
            title="Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({
                textAlign: "right",
              })
                ? "active"
                : ""
            }`}
            title="Align right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({
                textAlign: "justify",
              })
                ? "active"
                : ""
            }`}
            title="Justify"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            ☰
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Indentation */}

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            title="Decrease indentation"
            onClick={() => editor.chain().focus().decreaseIndent().run()}
          >
            ⇤
          </button>

          <button
            type="button"
            className="toolbar-button"
            title="Increase indentation"
            onClick={() => editor.chain().focus().increaseIndent().run()}
          >
            ⇥
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Lists */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("bulletList") ? "active" : ""
            }`}
            title="Bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            •☰
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive("orderedList") ? "active" : ""
            }`}
            title="Numbered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Blockquote */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("blockquote") ? "active" : ""
            }`}
            title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            ❝
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Link */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${isActive("link") ? "active" : ""}`}
            title="Add link"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href || "";

              setLinkUrl(previousUrl);

              setShowLinkInput((current) => !current);

              setShowImageInput(false);
            }}
          >
            🔗
          </button>

          {showLinkInput && (
            <div className="toolbar-popup">
              <input
                type="url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setLink();
                  }
                }}
              />

              <button type="button" onClick={setLink}>
                Apply
              </button>

              <button
                type="button"
                className="popup-secondary"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();

                  setLinkUrl("");
                  setShowLinkInput(false);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Image */}

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            title="Add image"
            onClick={() => {
              setShowImageInput((current) => !current);

              setShowLinkInput(false);
            }}
          >
            🖼
          </button>

          {showImageInput && (
            <div className="toolbar-popup image-popup">
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Image URL"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addImage();
                  }
                }}
              />

              <button type="button" onClick={addImage}>
                Insert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================
          EDITOR
      ================================================== */}

      <div className="story-editor-container">
        <EditorContent editor={editor} />
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="story-editor-footer">
        <span>{editor.getText().length} characters</span>

        <span>Rich text editor</span>
      </div>

      {/* ==================================================
          SUBMIT AREA
      ================================================== */}

      <div className="story-editor-submit">
        <div className="story-submit-status">
          {submitError && (
            <div className="story-submit-error">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="story-submit-success">{submitSuccess}</div>
          )}
        </div>

        <button
          type="button"
          className="story-submit-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="story-submit-spinner" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
};

export default StoryEditor;
