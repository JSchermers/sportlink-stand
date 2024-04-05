import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("sportlink-stand")
class SportlinkStand extends LitElement {
  static styles = css`
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
      max-width: 20rem
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
  `;

  @property()
  clientId?: string;

  @property()
  pouleCode?: string;

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

  private async getMeta() {
    const metaEls = document.getElementsByTagName("meta");
    this.clientId =
      this.clientId !== undefined
        ? this.clientId
        : metaEls.namedItem("clientId")?.content;
    this.pouleCode =
      this.pouleCode !== undefined
        ? this.pouleCode
        : metaEls.namedItem("pouleCode")?.content;

    if (!this.clientId || !this.pouleCode) {
      this.error = true;
    } else {
      this.data = await this.getData();
      this.loading = false;
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
          <td class="tabel-team">            
            ${team.teamnaam}
          </td>
          <td class="tabel-gs">
            ${team.aantalwedstrijden}
          </td>
          <td class="tabel-ds">
            ${team.doelsaldo}
          </td>
          <td class="tabel-pt">
            ${team.totaalpunten}
          </td>
        </tr>
      `
    })
  }

  private renderTable() {
    return html`
      <h2>Periodestand</h2>
      <table class="tabel-stand">
      <caption class="sr-only">Stand //to do dynamic</caption>
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
      : html` <p>Er is geen eerstvolgende wedstrijd bekend</p> `;
  }

  render(): any {
    return this.error
      ? html`<div>Er is helaas iets misgegaan</div>`
      : this.loading
        ? html` <div>loading</div>`
        : this.renderStand();
  }
}
