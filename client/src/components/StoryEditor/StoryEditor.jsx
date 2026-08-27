import { useEffect, useState } from "react";
import { EditorContent, Extension, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import "./StoryEditor.css";

const apiUrl = import.meta.env.VITE_API_URL;

/* ==================================================
   SLUG HELPER
================================================== */

const slugify = (text = "") => {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

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

              if (currentIndent < 6 && dispatch) {
                const transaction = state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentIndent + 1,
                });

                dispatch(transaction);
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

              if (currentIndent > 0 && dispatch) {
                const transaction = state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: currentIndent - 1,
                });

                dispatch(transaction);
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
  storyId = null,
  value = null,
  onChange,
  onSubmit,

  /*
   * Initial story values
   */
  slug: initialSlug = "",
  title: initialTitle = "",
  condition: initialCondition = "",
  category: initialCategory = "",
  image: initialImage = "",
  excerpt: initialExcerpt = "",
  published: initialPublished = false,

  /*
   * API
   */
  apiEndpoint = "/api/stories",
  method = storyId ? "PATCH" : "POST",
  submitLabel = storyId ? "Update Story" : "Submit Story",
  placeholder = "Start writing your story...",
}) => {
  /* ==================================================
     FORM STATE
  ================================================== */

  const [form, setForm] = useState({
    slug: initialSlug,
    title: initialTitle,
    condition: initialCondition,
    category: initialCategory,
    image: initialImage,
    excerpt: initialExcerpt,
    published: initialPublished,
  });

  /*
   * Track whether user has manually changed the slug.
   *
   * If false:
   * title changes automatically update slug.
   *
   * If true:
   * user's custom slug is preserved.
   */
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialSlug)
  );

  /* ==================================================
     TOOLBAR STATE
  ================================================== */

  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  /* ==================================================
     SUBMIT STATE
  ================================================== */

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  /* ==================================================
     FORM HELPERS
  ================================================== */

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      title: value,

      /*
       * Automatically generate slug until
       * the user manually edits it.
       */
      slug: slugManuallyEdited ? current.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value) => {
    setSlugManuallyEdited(true);

    updateField("slug", slugify(value));
  };

  /* ==================================================
     TIPTAP INITIALIZATION
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
      content: [{ type: "paragraph" }],
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
     UPDATE CONTENT DYNAMICALLY
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
     UPDATE FORM WHEN EDITING AN EXISTING STORY
  ================================================== */

  useEffect(() => {
    setForm({
      slug: initialSlug || "",
      title: initialTitle || "",
      condition: initialCondition || "",
      category: initialCategory || "",
      image: initialImage || "",
      excerpt: initialExcerpt || "",
      published: Boolean(initialPublished),
    });

    setSlugManuallyEdited(Boolean(initialSlug));
  }, [
    initialSlug,
    initialTitle,
    initialCondition,
    initialCategory,
    initialImage,
    initialExcerpt,
    initialPublished,
  ]);

  /* ==================================================
     SUBMIT / UPDATE STORY
  ================================================== */

  const handleSubmit = async () => {
    if (!editor || submitting) {
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    /* -----------------------------------------------
       Content
    ------------------------------------------------ */

    const content = editor.getJSON();

    const text = editor
      .getText()
      .replace(/\s+/g, " ")
      .trim();

    /* -----------------------------------------------
       Normalize form values
    ------------------------------------------------ */

    const title = form.title.trim();

    const condition = form.condition.trim();

    const category = form.category.trim();

    const image = form.image.trim();

    const excerpt = form.excerpt.trim();

    /*
     * Use custom slug if supplied.
     * Otherwise generate it from title.
     */
    const slug = slugify(form.slug || title);

    /* -----------------------------------------------
       Validation
    ------------------------------------------------ */

    if (!text) {
      setSubmitError("Please write something before submitting.");
      return;
    }

    if (!title) {
      setSubmitError("Please enter a story title.");
      return;
    }

    if (!slug) {
      setSubmitError("Please enter a story slug.");
      return;
    }

    if (!condition) {
      setSubmitError("Please select a condition.");
      return;
    }

    if (!category) {
      setSubmitError("Please select a category.");
      return;
    }

    if (!excerpt) {
      setSubmitError("Please enter a story excerpt.");
      return;
    }

    /* -----------------------------------------------
       API payload
       
       IMPORTANT:
       authorId is NOT included.
       
       Backend gets it from:
       req.user._id
    ------------------------------------------------ */

    const payload = {
      slug,
      title,
      condition,
      category,
      image,
      excerpt,
      content,
      published: Boolean(form.published),
    };

    try {
      setSubmitting(true);

      /*
       * POST:
       * /api/stories
       *
       * PATCH:
       * /api/stories/:id
       */
      const targetPath = storyId
        ? `${apiEndpoint}/${storyId}`
        : apiEndpoint;

      const endpoint = `${apiUrl}${targetPath}`;

      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        /*
         * IMPORTANT:
         * This sends the HTTP-only session cookie.
         */
        credentials: "include",

        body: JSON.stringify(payload),
      });

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

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        );
      }

      setSubmitSuccess(
        data?.message ||
          (storyId
            ? "Story updated successfully."
            : "Story submitted successfully.")
      );

      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error("Story operation failed:", error);

      setSubmitError(
        error?.message ||
          "Unable to save story. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==================================================
     LOADING
  ================================================== */

  if (!editor) {
    return (
      <div className="story-editor-loading">
        Loading editor...
      </div>
    );
  }

  const isActive = (name, attributes = {}) =>
    editor.isActive(name, attributes);

  /* ==================================================
     LINK HANDLER
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
     IMAGE HANDLER
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
          STORY DETAILS
      ================================================== */}

      <div className="story-form">

        {/* TITLE */}

        <div className="story-form-field">
          <label htmlFor="story-title">
            Title
          </label>

          <input
            id="story-title"
            type="text"
            value={form.title}
            onChange={(e) =>
              handleTitleChange(e.target.value)
            }
            placeholder="Enter story title"
          />
        </div>

        {/* SLUG */}

        <div className="story-form-field">
          <label htmlFor="story-slug">
            Slug
          </label>

          <input
            id="story-slug"
            type="text"
            value={form.slug}
            onChange={(e) =>
              handleSlugChange(e.target.value)
            }
            placeholder="story-url-slug"
          />

          <small>
            Used in the story URL.
          </small>
        </div>

        {/* CONDITION */}

        <div className="story-form-field">
          <label htmlFor="story-condition">
            Condition
          </label>

          <input
            id="story-condition"
            type="text"
            value={form.condition}
            onChange={(e) =>
              updateField(
                "condition",
                e.target.value
              )
            }
            placeholder="e.g. GBS"
          />
        </div>

        {/* CATEGORY */}

        <div className="story-form-field">
          <label htmlFor="story-category">
            Category
          </label>

          <input
            id="story-category"
            type="text"
            value={form.category}
            onChange={(e) =>
              updateField(
                "category",
                e.target.value
              )
            }
            placeholder="e.g. Newly Diagnosed"
          />
        </div>

        {/* IMAGE */}

        <div className="story-form-field">
          <label htmlFor="story-image">
            Cover Image URL
          </label>

          <input
            id="story-image"
            type="url"
            value={form.image}
            onChange={(e) =>
              updateField(
                "image",
                e.target.value
              )
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* EXCERPT */}

        <div className="story-form-field">
          <label htmlFor="story-excerpt">
            Excerpt
          </label>

          <textarea
            id="story-excerpt"
            value={form.excerpt}
            onChange={(e) =>
              updateField(
                "excerpt",
                e.target.value
              )
            }
            placeholder="Short description of the story"
            rows={4}
          />
        </div>

        {/* PUBLISHED */}

        <label className="story-published">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              updateField(
                "published",
                e.target.checked
              )
            }
          />

          <span>
            Publish this story
          </span>
        </label>
      </div>

      {/* ==================================================
          TOOLBAR
      ================================================== */}

      <div className="story-editor-toolbar">

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

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("paragraph")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setParagraph()
                .run()
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

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button bold ${
              isActive("bold")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
          >
            B
          </button>

          <button
            type="button"
            className={`toolbar-button italic ${
              isActive("italic")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
          >
            I
          </button>

          <button
            type="button"
            className={`toolbar-button underline ${
              isActive("underline")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleUnderline()
                .run()
            }
          >
            U
          </button>

          <button
            type="button"
            className={`toolbar-button strike ${
              isActive("strike")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
          >
            S
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
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
            className="toolbar-button"
            title="Align center"
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
            className="toolbar-button"
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
            className="toolbar-button"
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

        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            title="Decrease indentation"
            onClick={() =>
              editor
                .chain()
                .focus()
                .decreaseIndent()
                .run()
            }
          >
            ⇤
          </button>

          <button
            type="button"
            className="toolbar-button"
            title="Increase indentation"
            onClick={() =>
              editor
                .chain()
                .focus()
                .increaseIndent()
                .run()
            }
          >
            ⇥
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("bulletList")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            }
          >
            •☰
          </button>

          <button
            type="button"
            className={`toolbar-button ${
              isActive("orderedList")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
          >
            1.
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("blockquote")
                ? "active"
                : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBlockquote()
                .run()
            }
          >
            ❝
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* LINK */}

        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-button ${
              isActive("link")
                ? "active"
                : ""
            }`}
            title="Add link"
            onClick={() => {
              const previousUrl =
                editor.getAttributes("link").href ||
                "";

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
                onChange={(e) =>
                  setLinkUrl(e.target.value)
                }
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
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

        {/* IMAGE */}

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
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                placeholder="Image URL"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
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
        <span>
          {editor.getText().length} characters
        </span>

        <span>
          Rich text editor
        </span>
      </div>

      {/* ==================================================
          SUBMIT
      ================================================== */}

      <div className="story-editor-submit">
        <div className="story-submit-status">
          {submitError && (
            <div className="story-submit-error">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="story-submit-success">
              {submitSuccess}
            </div>
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
              {storyId
                ? "Updating..."
                : "Submitting..."}
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
