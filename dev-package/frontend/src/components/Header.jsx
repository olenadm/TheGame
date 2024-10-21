import { Row, Col } from "react-bootstrap";

const Header = (props) => {
  const { title, subTitle, txt } = props;
  return (
    <header className="mb-4 title">
      <Row>
        <Col xs={2} md={1} className="text-center">
          {" "}
          <img src="images/dice.png" alt="Dice" class="mx-auto" />
        </Col>
        <Col xs={10} md={11}>
          <h1 className="heading mb-0">{title}</h1>
          {subTitle && <h4 className="mb-3 text-color-change">{subTitle}</h4>}
          {txt && <p>{txt}</p>}
        </Col>
      </Row>
     
    </header>
  );
};
export default Header;
