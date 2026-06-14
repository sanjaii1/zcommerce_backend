const Blog = require("../models/Blog");

// Create Blog Post
const createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, imageUrl, author, isPublished } = req.body;

    // Generate slug from title if not provided
    const blogSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blogExists = await Blog.findOne({ slug: blogSlug });
    if (blogExists) {
      return res.status(400).json({ message: "Blog post with this slug already exists" });
    }

    const blog = await Blog.create({
      title,
      slug: blogSlug,
      excerpt,
      content,
      imageUrl,
      author,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Blog Posts
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Blog Post
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog Post
const updateBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, imageUrl, author, isPublished } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (title !== undefined) blog.title = title;
      if (slug !== undefined) {
        blog.slug = slug;
      } else if (title !== undefined) {
        blog.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      if (excerpt !== undefined) blog.excerpt = excerpt;
      if (content !== undefined) blog.content = content;
      if (imageUrl !== undefined) blog.imageUrl = imageUrl;
      if (author !== undefined) blog.author = author;
      if (isPublished !== undefined) blog.isPublished = isPublished;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog Post
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await Blog.deleteOne({ _id: blog._id });
      res.json({ message: "Blog post removed successfully" });
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
