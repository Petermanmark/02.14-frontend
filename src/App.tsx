import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

interface State {
  esemenyek: EsemenyData[];
  ujmegnevezes: string;
  ujresztvevo: string;
}

interface EsemenyData {
  id: number;
  megnevezes: string;
  resztvevok: number;
}
class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { esemenyek: [], ujmegnevezes: "", ujresztvevo: "" };
  }

  async loadEsemenyek() {
    const response = await fetch("http://localhost:3000/esemeny", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: EsemenyData[] = await response.json();
    this.setState({
      esemenyek: data,
    });
  }

  async addEsemeny(megnevezes: string, resztvevok: number) {
    const response = await fetch("http://localhost:3000/esemeny", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resztvevok,
        megnevezes,
      }),
    });
    this.loadEsemenyek();
  }

  async deleteEsemeny(id: number) {
    const array = this.state.esemenyek.filter((esemeny) => esemeny.id !== id);
    this.setState({ esemenyek: array });
    await fetch(`http://localhost:3000/esemeny/${id}`, {
      method: "DELETE",
    });
    this.loadEsemenyek();
  }

  componentDidMount() {
    this.loadEsemenyek();
  }

  render() {
    return (
      <>
        <div className="container" style={{ maxWidth: "1024px" }}>
          <div className="row mb-2">
            <div className="col-md-6">
              <label className="form-label">Helyszín</label>
              <input
                className="form-control"
                value={this.state.ujmegnevezes}
                onChange={(e) => {
                  this.setState({ ujmegnevezes: e.target.value });
                }}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="resztvevok" className="form-label">
                Résztvevők
              </label>
              <input
                type="number"
                className="form-control"
                id="resztvevok"
                value={this.state.ujresztvevo}
                onChange={(e) => {
                  this.setState({ ujresztvevo: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="row mb-2">
            <button
              className="btn btn-primary col-12"
              onClick={() => {
                if (this.state.ujresztvevo && this.state.ujmegnevezes) {
                  this.addEsemeny(
                    this.state.ujmegnevezes,
                    parseInt(this.state.ujresztvevo)
                  );
                }
              }}
            >
              Add
            </button>
          </div>
          <ul>
            {this.state.esemenyek.map((esemeny) => (
              <>
                <ul className="row list-group list-group-horizontal">
                  <li className="list-group-item col-5">
                    {esemeny.megnevezes}
                  </li>
                  <li className="list-group-item  col-5">
                    {esemeny.resztvevok}
                  </li>
                  <li className="d-flex list-group-item  col-2 justify-content-center">
                    <button type="button" className="btn btn-danger" onClick={() => this.deleteEsemeny(esemeny.id)}>Delete</button>
                    {/* <button onClick={() => this.deleteEsemeny(esemeny.id)}>
                      x
                    </button> */}
                  </li>
                </ul>
              </>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default App;
