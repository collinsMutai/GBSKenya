import React, { useEffect, useState } from "react";
import { EditorContent, Extension, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import "./StoryEditor.css";

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

const StoryEditor = ({
  value = null,
  onChange,
  placeholder = "Start writing your story...",
}) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

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

    content:
      value || {
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

  /**
   * Update editor when the parent supplies
   * different content, e.g. when editing an
   * existing story.
   */
  useEffect(() => {
    if (!editor || !value) {
      return;
    }

    const current = editor.getJSON();

    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="story-editor-loading">
        Loading editor...
      </div>
    );
  }

  // --------------------------------------------------
  // Toolbar helpers
  // --------------------------------------------------

  const isActive = (name, attributes = {}) =>
    editor.isActive(name, attributes);

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
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

  return (
    <div className="story-editor-wrapper">
      {/* ------------------------------------------ */}
      {/* Toolbar */}
      {/* ------------------------------------------ */}

      <div className="story-editor-toolbar">
        {/* History */}

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() =>
              editor.chain().focus().undo().run()
            }
          >
            ↶
          </button>

          <button
            type="button"
            className="toolbar-button"
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() =>
              editor.chain().focus().redo().run()
            }
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
            onClick={() =>
              editor.chain().focus().setParagraph().run()
            }
          >
            P
          </button>

          {[1, 2, 3].map((level) => (
            <button
              key={level}
              type="button"
              className={`toolbar-button ${
                isActive("heading", { level })
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level })
                  .run()
              }
            >
              H{level}
            </button>
          ))}
        </div>

        <div className="toolbar-divider" />

        {/* Text formatting */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button bold ${
              isActive("bold") ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
          >
            B
          </button>

          <button
            type="button"
            className={`toolbar-button italic ${
              isActive("italic") ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            I
          </button>

          <button
            type="button"
            className={`toolbar-button underline ${
              isActive("underline") ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            U
          </button>

          <button
            type="button"
            className={`toolbar-button strike ${
              isActive("strike") ? "active" : ""
            }`}
            onClick={() =>
              editor.chain().focus().toggleStrike().run()
            }
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
              isActive({ textAlign: "left" })
                ? "active"
                : ""
            }`}
            title="Align left"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign("left")
                .run()
            }
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({ textAlign: "center" })
                ? "active"
                : ""
            }`}
            title="Center"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign("center")
                .run()
            }
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({ textAlign: "right" })
                ? "active"
                : ""
            }`}
            title="Align right"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign("right")
                .run()
            }
          >
            ≡
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive({ textAlign: "justify" })
                ? "active"
                : ""
            }`}
            title="Justify"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign("justify")
                .run()
            }
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
            onClick={() =>
              editor.chain().focus().decreaseIndent().run()
            }
          >
            ⇤
          </button>

          <button
            type="button"
            className="toolbar-button"
            title="Increase indentation"
            onClick={() =>
              editor.chain().focus().increaseIndent().run()
            }
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
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            •☰
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive("orderedList") ? "active" : ""
            }`}
            title="Numbered list"
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
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
            onClick={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
          >
            ❝
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* Link */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("link") ? "active" : ""
            }`}
            title="Add link"
            onClick={() => {
              const previousUrl =
                editor.getAttributes("link").href || "";

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
                onChange={(event) =>
                  setLinkUrl(event.target.value)
                }
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setLink();
                  }
                }}
              />

              <button
                type="button"
                onClick={setLink}
              >
                Apply
              </button>

              <button
                type="button"
                className="popup-secondary"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .unsetLink()
                    .run();

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
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="Image URL"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addImage();
                  }
                }}
              />

              <button
                type="button"
                onClick={addImage}
              >
                Insert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------ */}
      {/* Editor */}
      {/* ------------------------------------------ */}

      <div className="story-editor-container">
        <EditorContent editor={editor} />
      </div>

      {/* ------------------------------------------ */}
      {/* Footer */}
      {/* ------------------------------------------ */}

      <div className="story-editor-footer">
        <span>
          {editor.storage.characterCount?.characters?.() || ""}
        </span>

        <span>
          Rich text editor
        </span>
      </div>
    </div>
  );
};

export default StoryEditor;
