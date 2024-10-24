import { Row, Col } from "react-bootstrap";

const Header = (props) => {
  const { title, subTitle, txt, img } = props;
  return (
    <header className="mb-4">
      <Row>
        <Col xs={2} md={1} className="text-center title">
          {" "}
          <img src="images/dice.png" alt="Dice" className="mx-auto" />
        </Col>
        <Col xs={10} md={8}>
          <h1 className="heading mb-3 lh-1">{title}</h1>
          {subTitle && (
            <h4 className="mb-3 text-color-change d-none d-md-block">
              {subTitle}
            </h4>
          )}
          {txt && <p className="d-none d-md-block">{txt}</p>}
        </Col>
        <Col xs={12} md={3} className="position-relative text-center">
          {img && (
            <img
              src={`/images/${img}`}
              alt="Backgammon game"
              className="character moving"
            />
          )}
        </Col>
      </Row>
    </header>
  );
};
export default Header;
