import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Badge, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import "../styles/app.scss";
import { useProfile } from "../contexts/ProfileContext";
import Header from "./Header";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

const GlossaryList = () => {
  const { profile } = useProfile(); // Use the context
  const [glossary, setGlossary] = useState([]); // Store glossary terms (drills topics)
  const [searchTerm, setSearchTerm] = useState(""); // Store the search term
  const [filteredGlossary, setFilteredGlossary] = useState([]); // Filtered glossary
  const [activeCategory, setActiveCategory] = useState(null); // Store active category filter
  const [allCategories, setAllCategories] = useState([]); // Store all unique categories
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch glossary terms from backend
    axios
      .get(`${apiBaseUrl}/api/v1/glossary`, { withCredentials: true })
      .then((response) => {
        setGlossary(response.data); // Set the glossary data (drill topics)
        setFilteredGlossary(response.data); // Initially, show all glossary items
        // Extract unique categories from glossary items
        const uniqueCategories = new Set();
        response.data.forEach((item) => {
          if (item.drill_categories) {
            item.drill_categories.forEach((category) =>
              uniqueCategories.add(category)
            );
          }
        });
        setAllCategories([...uniqueCategories]);
      })
      .catch((error) => console.error("Error fetching glossary:", error));
  }, []);

  const getRequiredPlan = () => {
    // Placeholder, assuming all drills are free for basic users
    return 4;
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterGlossary(value, activeCategory); // Search without category filtering
  };
  const toggleCategory = (category) => {
    // Toggle category filter on/off
    if (activeCategory === category) {
      setActiveCategory(null); // Remove filter if already active
      filterGlossary(searchTerm, null); // Reset filtering
    } else {
      setActiveCategory(category); // Set new active category
      filterGlossary(searchTerm, category); // Apply new category filter
    }
  };
  const filterGlossary = (term, category) => {
    const filtered = glossary.filter((item) => {
      const termMatch = term
        ? item.term.toLowerCase().includes(term) ||
          item.final_definition.toLowerCase().includes(term) ||
          item?.synonyms?.join(", ").toLowerCase().includes(term)
        : true;

      const categoryMatch = category
        ? item.drill_categories.includes(category)
        : true;

      return termMatch && categoryMatch;
    });
    setFilteredGlossary(filtered);
  };

  const renderGlossaryRows = () => {
    return filteredGlossary.map((item) => {
      const isPaid = profile && profile.Paid >= getRequiredPlan(); // Check if user has access

      return (
        <Row key={item.id} className="border-bottom py-3">
          <Col md={6}>
            <strong>{item.term}</strong>
            {!isPaid && (
              <FontAwesomeIcon
                icon={faLock}
                style={{ color: "red", marginLeft: "10px" }}
                title="Locked Content"
              />
            )}
            <div className="text-muted">{item.final_definition}</div>
          </Col>
          <Col md={6}>
            {item?.drill_categories.length > 0 && <strong>Categories:</strong>}
            <div>
              {item?.drill_categories &&
                item?.drill_categories.map((category, index) => (
                  <Badge key={index} pill bg="info" className="me-2 my-2">
                    {category}
                  </Badge>
                ))}
            </div>
            {item?.synonyms?.length > 0 && (
              <div>
                <strong>Synonyms:</strong> {item?.synonyms?.join(", ")}
              </div>
            )}
            {item.one_liners && (
              <div className="fst-italic">"{item.one_liners}"</div>
            )}
          </Col>
        </Row>
      );
    });
  };
  const renderCategoryBadges = () => {
    return allCategories.map((category, index) => (
      <Badge
        key={index}
        pill
        bg={activeCategory === category ? "info" : "secondary"} // Highlight active category
        className="me-2 mb-2"
        onClick={() => toggleCategory(category)}
        style={{ cursor: "pointer" }}
      >
        {category}
      </Badge>
    ));
  };
  return (
    <Container className="mt-5">
      <Header
        title=" Glossary"
        subTitle="Learn all the vocab to do with the game"
      />

      <section className="section-dark section pt-0 lesson">
        <Row>
          <Col>
            <Card className="drill-card m-3">
              <Card.Body>
                <Card.Title className="drill-title">
                  {/* Search box */}
                  <Form.Control
                    type="text"
                    placeholder="Search glossary terms..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="mb-3"
                  />
                </Card.Title>

                {/* Category badges at the top */}
                <div className="mb-3">
                  <h5 className="my-3">Filter by Category:</h5>
                  <div>{renderCategoryBadges()}</div>
                </div>
                {/*<Row className="mb-3">Drill Count: {filteredGlossary.length}</Row>*/}

                {/* Render glossary rows */}
                {renderGlossaryRows()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default GlossaryList;
