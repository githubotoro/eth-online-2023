// extension/content.js

const ethereumAddressRegex = /(0x[a-fA-F0-9]{40})\b/g;

// Helper function to process text nodes asynchronously
const processTextNodesAsync = async (textNodes) => {
	for (let index = 0; index < textNodes.length; index++) {
		const textNode = textNodes[index];
		const matches = textNode.nodeValue.match(ethereumAddressRegex);

		if (matches) {
			for (const match of matches) {
				const span = document.createElement("span");
				span.textContent = match;
				span.style.backgroundColor = "yellow"; // Customize the styling
				const replacedNode = textNode.splitText(
					textNode.nodeValue.indexOf(match)
				);
				replacedNode.nodeValue = replacedNode.nodeValue.replace(
					match,
					""
				);
				textNode.parentNode.insertBefore(span, replacedNode);
			}
		}
	}
};

const highlightEtherscanLinks = async () => {
	// Find all <a> tags with the 'data-bs-title' attribute containing Ethereum addresses
	const links = document.querySelectorAll("a");

	for (const link of links) {
		const hrefAttribute = link.getAttribute("href");
		const matches = hrefAttribute.match(ethereumAddressRegex);

		if (matches !== null) {
			link.style.backgroundColor = "yellow";

			// const match = matches[0];
			// const textContent = link.textContent;

			// const span = document.createElement("span");

			// span.innerText = textContent;
			// span.style.backgroundColor = "yellow";

			// link.style
			// link.innerHTML = "";
			// link.appendChild(span);
		}
	}
};

const highlightEthereumAddresses = async () => {
	const textNodes = [];
	const treeWalker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT
	);

	let currentNode;
	while ((currentNode = treeWalker.nextNode())) {
		textNodes.push(currentNode);
	}

	// Use async/await to process text nodes and etherscan links
	await processTextNodesAsync(textNodes);
	await highlightEtherscanLinks();
};

// Run the function when the page is loaded
window.addEventListener("load", highlightEthereumAddresses);
