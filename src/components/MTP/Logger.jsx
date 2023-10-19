class Logger extends Component {
  constructor(props) {
    super(props);
    this.logData = [];
  }

  log(message) {
    this.logData.push(message);
  }
  sendLogDataToServer = () => {};
  clearLogData() {}
}
