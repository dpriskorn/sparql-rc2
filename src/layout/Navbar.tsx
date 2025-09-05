import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <a href="#main" className="visually-hidden visually-hidden-focusable">
        Skip to main content
      </a>
      <Navbar expanded={expanded} expand="md" bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">SPARQL Recent Changes 2</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarSupportedContent"
            onClick={() => setExpanded(expanded ? false : true)}
          />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="ms-auto">
              <Nav.Link href="/validate">Validate</Nav.Link>
              <Nav.Link
                href="https://www.wikidata.org/wiki/Wikidata:Tools/SPARQL Recent Changes 2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Nav.Link>
              <Nav.Link
                href="https://github.com/dpriskorn/sparql-rc2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code
              </Nav.Link>
              <Nav.Link
                href="https://github.com/dpriskorn/sparql-rc2/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </Nav.Link>
              <Nav.Link href="/co-maintainer">Become a Co-Maintainer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
