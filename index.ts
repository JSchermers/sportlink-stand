import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sportlink-stand")
class SportlinkStand extends LitElement {
  static styles = css`
  thead .tabel-gs,
  thead .tabel-ds,
  thead .tabel-pt,
  thead .tabel-team {
    font-weight: var(--sportlink-wedstrijd-tabel-header-font-weight, 600)
  }

    .tabel-gs,
    .tabel-ds,
    .tabel-pt {
      text-align: right;
      width: 4ch;
    }

    .tabel-pos {
      width: 3ch;
    }

    .tabel-stand {
      width: 100%;
      max-width: 20rem;
      font-family: var(--sportlink-wedstrijd-tabel-font-family, inherit)
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }

    .tabel-eigen-team {
      font-weight: var(--sportlink-wedstrijd-eigenteam-font-weight, 600);
    }

    .titel {
      font-family: var(--sportlink-wedstrijd-titel-font-family, inherit);
      font-weight: var(--sportlink-wedstrijd-titel-font-weight, inherit);
      font-size: var(--sportlink-wedstrijd-titel-font-size, inherit);
      text-align: var(--sportlink-wedstrijd-titel-text-align, start);
    }
  `;

  @property()
  clientId?: string;

  @property()
  teamCode?: string;

  private pouleCode? :string

  @property()
  loading: boolean = true;

  @property()
  error: boolean = false;

  data: any[] = [];

  URL = "https://data.sportlink.com/";

  private async getData(): Promise<any[]> {
    const url: URL = new URL(`${this.URL}/periodestand`);
    url.searchParams.append("client_id", this.clientId as unknown as string);
    url.searchParams.append("poulecode", this.pouleCode as unknown as string);
    return await fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return new Error("error in call");
      }
    });
  }

  private async getPouleCode() {
    const url: URL = new URL(`${this.URL}/teampoulelijst`);
    url.searchParams.append("client_id", this.clientId as unknown as string);
    url.searchParams.append("teamcode", this.teamCode as unknown as string);
    url.searchParams.append("lokaleteamcode", "-1");
    return await fetch(url).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return new Error("error in call");
      }
    });
  }

  private async getMeta() {
    const metaEls = document.getElementsByTagName("meta");
    this.clientId =
      this.clientId !== undefined
        ? this.clientId
        : metaEls.namedItem("clientId")?.content;
    this.teamCode =
      this.teamCode !== undefined
        ? this.teamCode
        : metaEls.namedItem("teamCode")?.content;

    if (!this.clientId || !this.teamCode) {
      this.error = true;
    } else {
      const poules = await this.getPouleCode();
      if (poules) {
        const poule = poules.find((poule: any) => {
          return !poule.teamnaam.includes("KNVB")
        })
        this.pouleCode = poule.poulecode;
        this.data = await this.getData();
        this.loading = false;
      }
      else {
        this.error = true;
      }

    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.getMeta();
    this.dispatchEvent(new CustomEvent("connected"));
  }

  private renderTableRow() {
    return this.data?.map((team) => {
      return html`
        <tr>
          <td class="tabel-pos">
            ${team.positie}
          </td>
          <td class="tabel-team ${team.eigenteam === "true" ? "tabel-eigen-team": null}">            
            ${team.teamnaam}
          </td>
          <td class="tabel-gs ${team.eigenteam === "true" ? "tabel-eigen-team": null}">
            ${team.aantalwedstrijden}
          </td>
          <td class="tabel-ds ${team.eigenteam === "true" ? "tabel-eigen-team": null}">
            ${team.doelsaldo}
          </td>
          <td class="tabel-pt ${team.eigenteam === "true" ? "tabel-eigen-team": null}">
            ${team.totaalpunten}
          </td>
        </tr>
      `
    })
  }

  private renderTable() {
    return html`
      <h2 class="titel"><slot name="title"></slot></h2>
      <table class="tabel-stand">
      <caption class="sr-only"><slot name="ally_title"></slot></caption>
      <thead>
        <tr>
          <td class="tabel-pos"><span class="sr-only">Positie</span></td>
          <td class="tabel-team">Team</td>
          <td class="tabel-gs">GS</td>
          <td class="tabel-ds">DS</td>
          <td class="tabel-pt">PP</td>             
        </tr>
      </thead>
      <tbody>
        ${this.renderTableRow()}
      </tbody>
    </table>
    `
  }

  private renderStand(): any {
    return this.data?.length > 0
      ? html`
          <div class="stand-main">
            ${this.renderTable()}
          </div>
        `
      : html` <p><slot name="nostandings">Er is geen stand bekend.</slot></p> `;
  }

  render(): any {
    return this.error
      ? html`<div><slot name="error">Helaas, er is iets misgegaan.</slot></div>`
      : this.loading
        ? html` <div>loading</div>`
        : this.renderStand();
  }
}
