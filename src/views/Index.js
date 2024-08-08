/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const year = new Date().getFullYear();

  useEffect(() => {
    const getCurrYearData = async () => {
      try {
        const response = await fetch('https://eyybq7ts3yll3j2krqwsxahcve0sqhzp.lambda-url.us-east-1.on.aws/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('currYearData', JSON.stringify(data.data));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        localStorage.setItem('currYearData', []);
      }
    }

    const getPrevYearData = async () => {
      try {
        const response = await fetch('https://p2p5vkhb5lnr5rv7w2yycsuljq0egyrc.lambda-url.us-east-1.on.aws/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('prevYearData', JSON.stringify(data.data));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        localStorage.setItem('prevYearData', []);
      }
    }

    const getCurrYearOrders = async () => {
      try {
        const response = await fetch('https://y2zquy3wyx77yejqwmp3il66uy0vlzfq.lambda-url.us-east-1.on.aws/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('ordersData', JSON.stringify(data.data));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        localStorage.setItem('ordersData', []);
      }
    }

    getCurrYearData();
    getPrevYearData();
    getCurrYearOrders();
  }, []);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const handlePrevYear = (e) => {
    toggleNavs(e, 2); 
  }

  const handleCurrYear = (e) => {
    toggleNavs(e, 1); 
    window.location.reload();
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={handleCurrYear}
                        >
                          <span className="d-none d-md-block">{year}</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={handlePrevYear}
                        >
                          <span className="d-none d-md-block">{year-1}</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders in {year}</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
