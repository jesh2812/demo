import React from "react";
import "./LandingPage.css";
import terraformNewIcon from "./terraformNewIcon.svg";
import finopsIconNew from "./finopsIconNew.png";
import datahubIconNew from "./datahubIconNew.png";
import modernizationNew from "./modernizationNew.jpg"
import sqlParsing from "./sqlParsing.png";
import dataLineage from "./dataLineage.png";
import { useNavigate } from "react-router-dom";
//import linkConfig from "./linkConfig.js"

const LandingPage = () => {
  const navigate = useNavigate()
  console.log(process.env.REACT_APP_DATACATALOG,"linkcheck")
  return (
    <div className="landing-container dotted">
      <div className="search-container">
        <div className="search_input">
          <input
            placeholder="search modules"
            data-items="4"
            type="text"
            class="search-query"
          />
          <span id="search-bar-span"></span>
          <div className="icon">
            <i class="fas fa-search"></i>
          </div>
        </div>

        <div className="module_display_container">
          <div className="module_dispaly-div1">
            <div className="square-div"></div>
            <div className="square-div"></div>
          </div>
          <div className="module_dispaly-div2">
            <div className="square-div"></div>
            <div className="circle-div"></div>
          </div>
        </div>
      </div>

      <div className="modules-container">
        <div className="module-card newCards" onClick={() => navigate("/templates")}>
          <img
            src={terraformNewIcon}
            style={{ height: "50px", width: "50px" }}
          ></img>
          <h1 style={{ fontSize:"20px",fontWeight:"bold" }}>Tiger Terraform</h1>
        </div>

        <div className="module-card newCards">
          <img
            src={finopsIconNew}
            style={{ height: "50px", width: "50px" }}
          ></img>
          <h1 style={{ fontSize:"20px",fontWeight:"bold" }}>Tiger<br/> Finops</h1>
        </div>

        <a href={process.env.REACT_APP_DATACATALOG}>
        <div className="module-card newCards">
          <img
        
            src={datahubIconNew}
            style={{ height:"50px",width:"70px" }}
          ></img>

          <h1 style={{ fontSize:"20px",fontWeight:"bold" }}>Tiger Data Catalog</h1>
        </div>
        </a>


        <a href={process.env.REACT_APP_DATALINEAGE}>
        <div className="module-card newCards">
          <img
            src={dataLineage}
            style={{ height: "50px", width: "70px" }}
          ></img>
          <h1 style={{ fontSize:"20px",fontWeight:"bold" }}>Tiger Data Lineage</h1>
        </div>
        </a>

        <a href={process.env.REACT_APP_DATAMODERNIZATION}>
        <div className="module-card newCards">
          <img
            src={modernizationNew}
            style={{ height: "70px", width: "70px" }}
          ></img>
          <h1 style={{ fontSize:"18px",fontWeight:"bold" }}>Data<br/>Modernization Tool</h1>
        </div>
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
