import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer mb-3">
      <div className="container">
        Design and <a href="https://github.com/dpriskorn/sparql-rc2">code</a> by{" "}
        <a
          href="https://www.wikidata.org/wiki/User:So9q"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nizo Priskorn
        </a>
        . Thanks to{" "}
        <a
          href="https://www.wikidata.org/wiki/User:Salgo60"
          target="_blank"
          rel="noopener noreferrer"
        >
          Salgo60
        </a>{" "}
        for testing.
      </div>
    </footer>
  );
};

export default Footer;
