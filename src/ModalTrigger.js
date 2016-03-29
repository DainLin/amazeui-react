'use strict';

var React = require('react');
var cloneElement = React.cloneElement;
var OverlayMixin = require('./mixins/OverlayMixin');
var DimmerMixin = require('./mixins/DimmerMixin');
var createChainedFunction = require('./utils/createChainedFunction');

var ModalTrigger = React.createClass({
  mixins: [OverlayMixin, DimmerMixin],

  propTypes: {
    modal: React.PropTypes.node.isRequired,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    title: React.PropTypes.string,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      isModalActive: false,
      modalWidth: null,
      modalMarginLeft: null,
      modalHeight: null,
      modalMarginTop: null
    };
  },

  componentDidMount: function() {
    if (this.props.show) {
      this.open();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.show && nextProps.show !== this.props.show) {
      this.open();
    }
  },

  open: function() {
    this.setState({
      isModalActive: true
    }, this.setModalStyle);
  },

  close: function() {
    this.setState({
      isModalActive: false
    });

    if (this.props.onHide) {
      this.props.onHide();
    }
  },

  toggle: function() {
    if (this.state.isModalActive) {
      this.close();
    } else {
      this.open();
    }
  },

  setModalStyle: function() {
    if (!this.isMounted()) {
      return;
    }

    // TODO: selector
    var modal = this.getOverlayDOMNode().querySelector('.am-modal');

    if (!modal) {
      return;
    }

    var style = {};

    if (this.props.modalHeight) {
      style.modalHeight = this.props.modalHeight;
      style.modalMarginTop = -this.props.height / 2;
    } else {
      style.modalMarginTop = -modal.offsetHeight / 2;
    }

    if (this.props.modalWidth) {
      style.modalWidth = this.props.modalWidth;
      style.modalMarginLeft = -this.props.modalWidth / 2;
    }

    this.setState(style);
  },

  // overlay is the modal
  renderOverlay: function() {
    if (!this.state.isModalActive) {
      return <span />;
    }

    return cloneElement(
      this.props.modal,
      {
        onRequestClose: this.close,
        marginTop: this.state.modalMarginTop,
        marginLeft: this.state.modalMarginLeft,
        modalWidth: this.state.modalWidth,
        modalHeight: this.state.modalHeight,
        title: this.props.modal.props.title || this.props.title,
        onConfirm: createChainedFunction(this.props.onConfirm, this.close),
        onCancel: createChainedFunction(this.props.onCancel, this.close)
      }
    );
  },

  render: function() {
    // if "show" is defined, use "show" to control the modal
    if (typeof this.props.show !== 'undefined') {
      return <div> {this.props.children} </div>;
    }

    var child = React.Children.only(this.props.children);
    var props = {};

    props.onClick = createChainedFunction(child.props.onClick, this.toggle);
    props.onMouseOver = createChainedFunction(child.props.onMouseOver,
      this.props.onMouseOver);
    props.onMouseOut = createChainedFunction(child.props.onMouseOut,
      this.props.onMouseOut);
    props.onFocus = createChainedFunction(child.props.onFocus,
      this.props.onFocus);
    props.onBlur = createChainedFunction(child.props.onBlur,
      this.props.onBlur);

    return cloneElement(child, props);
  }
});

module.exports = ModalTrigger;
