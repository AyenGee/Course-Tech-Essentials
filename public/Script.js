document.getElementById("degree").addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const degree = event.target.value.trim();
    const resultsDiv = document.getElementById("results");

    // Clear previous results
    resultsDiv.innerHTML = "";

    if (!degree) {
      resultsDiv.innerHTML = "<p>Please enter a degree.</p>";
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/gadgets/${degree}`);

      if (!response.ok) {
        resultsDiv.innerHTML = `<p>Degree not found.</p>`;
        return;
      }

      const data = await response.json();

      // Helper function to generate category HTML with labels
      const generateCategoryHTML = (category, label) => {
        return `
          <h5>${label}</h5>
          <div class="category-group">
            <h6>Expensive</h6>
            <div class="items-container">${generateItemList(category.expensive)}</div>
            
            <h6>Affordable</h6>
            <div class="items-container">${generateItemList(category.affordable)}</div>
            
            <h6>Cheap</h6>
            <div class="items-container">${generateItemList(category.cheap)}</div>
          </div>
        `;
      };

      // Helper function to generate item list
      const generateItemList = (items) => {
        return items.map(item =>
          `<div class="item">
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}<br>$${item.price}</span>
          </div>`
        ).join("");
      };

      // Generate results HTML
      resultsDiv.innerHTML = `
        <h3>Faculty: ${data.faculty}</h3>
        <h4>Degree: ${data.degree}</h4>
        ${generateCategoryHTML(data.categories.laptops, "Laptops")}
        ${generateCategoryHTML(data.categories.tablets, "Tablets")}
      `;

    } catch (error) {
      resultsDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
  }
});
