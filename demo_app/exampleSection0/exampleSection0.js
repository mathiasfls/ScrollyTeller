/* globals PR */
import { select } from 'd3';
import { forIn } from 'lodash';
import './data/narrationExampleSection0.csv';

const snippets = {
  onActivate:
    `{ // SECTION CONFIGURATION OBJECT
    // ... other properties
    onActivateNarrationFunction: function ({ trigger, graphId }) {
        const [first, second] = trigger.split(':');

        switch (first) {
          case 'opacity':
            select(\`#\${graphId}\`).style('opacity', +second);
            break;
          case 'backgroundColor':
            select(\`#\${graphId}\`).style('background', second);
            break;
          default:
        }
      },
  } // SECTION CONFIGURATION OBJECT`,
  onScroll:
    `{ // SECTION CONFIGURATION OBJECT
      // ... other properties
      onScrollFunction: function ({ progress, trigger, graphId }) {
        /** use trigger specified in the narration csv file to trigger actions */
        switch (trigger) {
          case 'graph:fadein':
            /** set graph opacity based on progress to fade graph in */
            select(\`#\${graphId}\`).style('opacity', progress);
            break;
          case 'graph:fadeout':
            /** set graph opacity based on progress to fade graph out */
            select(\`#\${graphId}\`).style('opacity', 1 - progress);
            break;
          default:
        },
    } // SECTION CONFIGURATION OBJECT`,
};

/** section configuration object with identifier, narration, and data (for the graph)  */
export default {
  /** identifier used to delineate different sections.  Should be unique from other sections
   * identifiers */
  sectionIdentifier: 'myExampleSection0',

  /** narration can be either of the following 3 options:
   *  1) a string representing an absolute file path to a file of the following types:
   *      'csv', 'tsv', 'json', 'html', 'txt', 'xml', which will be parsed by d3.promise
   *  2) array of narration objects,
   *  3) a promise to return an array of narration objects in the appropriate form
   * See README for the specfication of the narration objects */
  narration: 'demo_app/exampleSection0/data/narrationExampleSection0.csv',

  /** data can be either of the following 4 options:
   *  1) a string representing an absolute file path to a file of the following types:
   *      'csv', 'tsv', 'json', 'html', 'txt', 'xml', which will be parsed by d3.promise
   *  2) array of data objects
   *  3) a promise to return an array of narration objects in the appropriate form
   *  4) undefined
   */
  // data: 'demo_app/exampleSection0/data/dataBySeries.csv',
  /** data as array example */
  // data: [ {}, ],
  /** data as promise example */
  // data: d3promise.csv('demo_app/exampleSection0/data/dataBySeries.csv'),

  convertTriggerToObject: true,

  /** optional function to reshape data after queries or parsing from a file */
  reshapeDataFunction:
    function reshapeData(data) {
      // do any data reshaping here and return the processed data
      if (data) {
        /** example: convert x and y string variables to numbers */
        return data.map((datum) => {
          return {
            x: +datum.x,
            y: +datum.y,
          };
        });
      }
      return [];
    },

  /**
   * Called AFTER data is fetched, and reshapeDataFunction is called.  This method should
   * build the graph and return an instance of that graph, which will passed as arguments
   * to the onScrollFunction and onActivateNarration functions.
   *
   * This function is called as follows:
   * buildGraphFunction(graphId, sectionConfig)
   * @param {string} graphId - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
   * @param {object} sectionConfig - the configuration object passed to ScrollyTeller
   * @param {string} [sectionConfig.sectionIdentifier] - the identifier for this section
   * @param {object} [sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
   * @param {object} [sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
   * @param {object} [sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
   * @param {object} [sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
   * @param {object} [params.sectionConfig.elementResizeDetector] - the element-resize-detector object: see https://github.com/wnr/element-resize-detector for usage
   * @returns {object} - chart instance
   */
  buildGraphFunction: function buildGraph({ graphId, sectionConfig }) {
    // build graph
    // render using any initial data (sectionConfig.data) here
    // return the result to store in sectionConfig.graph
  },

  /**
   * Called upon scrolling of the section. See argument list below, this function is called as:
   * onScrollFunction({ index, progress, element, graphId, sectionConfig, trigger })
   * @param {object} [params] - object containing parameters
   * @param {number} [params.index] - index of the active narration object
   * @param {number} [params.progress] - 0-1 (sort of) value indicating progress through the active narration block
   * @param {HTMLElement} [params.element] - the narration block DOM element that is currently active
   * @param {string} [params.trigger] - the trigger attribute for narration block that is currently active
   * @param {string} [params.graphId] - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
   * @param {object} [params.sectionConfig] - the configuration object passed to ScrollyTeller
   * @param {string} [params.sectionConfig.sectionIdentifier] - the identifier for this section
   * @param {object} [params.sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
   * @param {object} [params.sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
   * @param {object} [params.sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
   * @param {object} [params.sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
   * @param {object} [params.sectionConfig.elementResizeDetector] - the element-resize-detector object: see https://github.com/wnr/element-resize-detector for usage
   * @returns {void}
   */
  onScrollFunction: function onScroll({ state, graphId }) {
    if (state.style) {
      const myGraph = select(`#${graphId}`);

      forIn(state.style, (value, key) => {
        myGraph.style(key, value);
      });
    }
  },

  /**
   * Called when a narration block is activated.
   * See argument list below, this function is called as:
   * onActivateNarration({ index, progress, element, trigger, graphId, sectionConfig })
   * @param {object} [params] - object containing parameters
   * @param {number} [params.index] - index of the active narration object
   * @param {number} [params.progress] - 0-1 (sort of) value indicating progress through the active narration block
   * @param {HTMLElement} [params.element] - the narration block DOM element that is currently active
   * @param {string} [params.trigger] - the trigger attribute for narration block that is currently active
   * @param {string} [params.direction] - the direction the event happened in (up or down)
   * @param {string} [params.graphId] - id of the graph in this section. const myGraph = d3.select(`#${graphId}`);
   * @param {object} [params.sectionConfig] - the configuration object passed to ScrollyTeller
   * @param {string} [params.sectionConfig.sectionIdentifier] - the identifier for this section
   * @param {object} [params.sectionConfig.graph] - the chart instance, or a reference containing the result of the buildChart() function above
   * @param {object} [params.sectionConfig.data] - the data that was passed in or resolved by the promise and processed by reshapeDataFunction()
   * @param {object} [params.sectionConfig.scroller] - the scrollama object that handles activation of narration, etc
   * @param {object} [params.sectionConfig.cssNames] - the CSSNames object containing some useful functions for getting the css identifiers of narrations, graph, and the section
   * @param {object} [params.sectionConfig.elementResizeDetector] - the element-resize-detector object: see https://github.com/wnr/element-resize-detector for usage
   * @returns {void}
   */
  onActivateNarrationFunction: function onActivateNarration({ state, graphId }) {
    if (state.code) {
      select(`#${graphId}`)
        .html(`<pre class="prettyprint lang-js">${snippets[state.code]}</pre>`);
      PR.prettyPrint();
    } else {
      select(`#${graphId}`).html('');
    }
  },
};
