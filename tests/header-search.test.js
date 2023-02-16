import { suggestion, source, onConfirm, addFormEvents, } from "../src/js/header-search";
import { JSDOM } from "jsdom";

describe("suggestion function tests", () => {
  test("suggestion function truncates long input", () => {
    const longInput = "To be, or not to be, that is the question";
    const result = suggestion(longInput);
    expect(result).toContain("...");
  })
});

describe("source function tests", () => {
  const createMockXHR = (status = 400, responseJSON = {}) => {
    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      status: status,
      responseText: JSON.stringify(responseJSON),
    };
    return mockXHR;
  };
  const oldXMLHttpRequest = window.XMLHttpRequest;
  const populateResults = jest.fn();
  let mockXHR = null;

  beforeEach(() => {
    mockXHR = createMockXHR();
    window.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
    jest.restoreAllMocks();
  });

  test("non 200 status does not retrieve list of queries", () => {
    source("covid", populateResults);
    mockXHR.status = 300;
    mockXHR.responseText = JSON.stringify([
      { query: "covid" },
      { query: "covid pass" },
      { query: "covid vaccination" }
    ]);
    mockXHR.onload();

    expect(mockXHR.open).toBeCalledWith("GET", "https://api.nhs.uk/site-search/Autocomplete?q=covid&api-version=1");
    expect(mockXHR.send).toHaveBeenCalledTimes(1);
    expect(populateResults.mock.calls.length).toBe(0);
  });

  test("200 status retrieves the list of queries calling the source function", () => {
    source("gout", populateResults);
    mockXHR.status = 200;
    mockXHR.responseText = JSON.stringify([
      { query: "gut problems" },
      { query: "gut pain" },
      { query: "mouth ulcers" }
    ]);
    mockXHR.onload();

    expect(mockXHR.open).toBeCalledWith("GET", "https://api.nhs.uk/site-search/Autocomplete?q=gout&api-version=1");
    expect(mockXHR.send).toHaveBeenCalledTimes(1);
    expect(populateResults.mock.lastCall[0]).toContain("mouth ulcers");
    expect(populateResults.mock.lastCall[0].length).toBe(3);
  });
});

describe("onConfirm function tests", () => {
  const realLocation = window.location;

  afterEach(() => { window.location = realLocation });

  test("onConfirm redirects to correct NHS Search page", () => {
    delete window.location;
    window.location = new URL("http://testing.com/");
    expect(window.location.href).toEqual("http://testing.com/");

    onConfirm("covid");
    expect(window.location.href).toEqual("https://www.nhs.uk/search/?q=covid");
  });
});

describe("addFormEvents function tests", () => {
  const realDocument = global.document;
  const dom = new JSDOM(`
  <p>Hello world</p>
  <button id="search-field">Search field </button>
  <button id="search">search </button>
  <button id="not-search-field">not-search-field </button>
  `);

  beforeEach(() => {
    delete global.document;
    global.document = dom.window.document;
  });

  afterEach(() => {
    global.document = realDocument;
    jest.restoreAllMocks();
  });

  test("addEventListener is called with correct event type", () => {
    const el = document.getElementById("search");
    const mockAddEventListener = jest.spyOn(el, "addEventListener");
    
    addFormEvents(el);
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockAddEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
  });

  test("submit not called with incorrect active element", () => {
    const el = document.getElementById("search");
    el.submit = jest.fn();
    document.getElementById("not-search-field").focus();
    jest.spyOn(el, "addEventListener").mockImplementation((event, cb) => cb({ key: "Enter" }));

    addFormEvents(el);
    expect(el.submit).toHaveBeenCalledTimes(0);
  });

  test("submit not called with incorrect key", () => {
    const el = document.getElementById("search");
    el.submit = jest.fn();
    document.getElementById("search-field").focus();
    jest.spyOn(el, "addEventListener").mockImplementation((event, cb) => cb({ key: "P" }));

    addFormEvents(el);
    expect(el.submit).toHaveBeenCalledTimes(0);
  });

  test("submit called with correct active element and key", () => {
    const el = document.getElementById("search");
    el.submit = jest.fn();
    document.getElementById("search-field").focus();
    jest.spyOn(el, "addEventListener").mockImplementation((event, cb) => cb({ key: "Enter" }));

    addFormEvents(el);
    expect(el.submit).toHaveBeenCalledTimes(1);
  });
});
