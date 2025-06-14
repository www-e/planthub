document.addEventListener("DOMContentLoaded", () => {
  const blogsContainer = document.getElementById("blogs-list");

  // Fetch blog data from API
  async function loadBlogs() {
    try {
      const res = await fetch("https://planthub.mhmud.com/api/blog/blogs");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== "success" || !Array.isArray(data.blogs)) {
        throw new Error("Unexpected API response");
      }
      renderBlogs(data.blogs);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      blogsContainer.innerHTML = `<p class="error">Failed to load blogs. Please try again later.</p>`;
    }
  }

  function renderBlogs(blogs) {
    blogsContainer.innerHTML = "";
    blogs.forEach((blog) => {
      const blogEl = createBlogPostElement(blog);
      blogsContainer.appendChild(blogEl);
      initializeSlider(blogEl);
      initializeReadMore(blogEl);
    });
  }

  function createBlogPostElement(blog) {
    const article = document.createElement("article");
    article.className = "blog-post";
    article.dataset.blogId = blog.id;

    const imgList = Array.isArray(blog.images)
      ? [
          {
            image_path: blog.cover_image,
          },
          ...blog.images,
        ]
      : [];
    const sliderHtml = `
      <div class="blog-image-slider">
        <div class="slider-images"> 
          ${imgList
            .map(
              (img) =>
                `<img src="https://planthub.mhmud.com/storage/${img.image_path}" alt="Blog Image">`
            )
            .join("")}
        </div>
        ${
          imgList.length > 1
            ? `
          <button class="slider-btn prev-btn"><i class="fas fa-chevron-left"></i></button>
          <button class="slider-btn next-btn"><i class="fas fa-chevron-right"></i></button>
          <div class="slider-dots">
            ${imgList
              .map(
                (_, i) =>
                  `<span class="dot ${
                    i === 0 ? "active" : ""
                  }" data-index="${i}"></span>`
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>`;
    const previewText = blog.category?.description || "";
    const fullText = blog.text || "";

    const contentHtml = `
      <div class="blog-content">
        <h2 class="blog-title">${blog.name}</h2>
        <p class="blog-meta">By ${blog.admin?.name || "Unknown"} | ${new Date(
      blog.created_at
    ).toLocaleDateString()}</p>
        <p class="blog-description">
          <span class="short-text">${previewText}</span><br>
          <span class="full-text" style="display:none;">${fullText.replace(
            /\n/g,
            "<br>"
          )}</span>
        </p>
        <a href="#" class="read-more-btn">Read More</a>
      </div>`;

    article.innerHTML = sliderHtml + contentHtml;
    return article;
  }

  function initializeSlider(container) {
    const slider = container.querySelector(".slider-images");
    if (!slider) return;

    const images = slider.querySelectorAll("img");
    if (images.length < 2) return; // no slider controls

    const prev = container.querySelector(".prev-btn"),
      next = container.querySelector(".next-btn"),
      dots = container.querySelectorAll(".dot");
    let idx = 0,
      total = images.length;

    function update() {
      slider.style.transform = `translateX(${-idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    }

    prev.addEventListener("click", () => {
      idx = (idx - 1 + total) % total;
      update();
    });
    next.addEventListener("click", () => {
      idx = (idx + 1) % total;
      update();
    });
    dots.forEach((dot) =>
      dot.addEventListener("click", () => {
        idx = parseInt(dot.dataset.index);
        update();
      })
    );
  }

  function initializeReadMore(container) {
    const btn = container.querySelector(".read-more-btn");
    const full = container.querySelector(".full-text");
    const short = container.querySelector(".short-text");

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = full.style.display === "block";
      full.style.display = isOpen ? "none" : "block";
      short.style.display = isOpen ? "inline" : "none";
      btn.textContent = isOpen ? "Read More" : "Read Less";
    });
  }

  // Kick off fetch
  loadBlogs();
});
