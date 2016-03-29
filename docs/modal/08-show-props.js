const Example = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render() {
    const modal = <Modal title="Amaze UI Modal">通过ModalTrigger的props控制Modal</Modal>;

    return (
      <div>
        <Button amStyle="primary" onClick={this.open}>
          Launch modal
        </Button>
        <ModalTrigger modal={modal} show={this.state.showModal} onHide={this.close}/>
      </div>
    );
  }
});

ReactDOM.render(<Example/>, mountNode);
