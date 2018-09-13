import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

import './CarouselStyles.css';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      centerVal: -1,
    };

    this.centerCard = this.centerCard.bind(this);
  }

  componentDidMount() {
    this.setState({
      centerVal: ReactDOM.findDOMNode(this).getBoundingClientRect().left +
                  ReactDOM.findDOMNode(this).getBoundingClientRect().width / 2,
    });
  }

  centerCard() {
    // take another props function where we toggle each class
    if (typeof this.props.translateCarousel === 'function') {
      this.props.translateCarousel(this.state.centerVal);
    }

    if (typeof this.props.toggleButtons === 'function') {
      this.props.toggleButtons(this.props.idx);
    }
  }

  render() {
    var divClasses = classNames({
      'carousel__cell': true,
      'carousel__cell--selected': this.props.selected,
    });

    return (
      <div className={divClasses} onClick={this.centerCard}/>
    )
  }
}

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      centerVal: -1,
      translateX: 0,
      selectedButtons: [true, false, false, false],
    };

    this.getCenterCoordinate = this.getCenterCoordinate.bind(this);
    this.translateCarousel = this.translateCarousel.bind(this);
    this.toggleButtons = this.toggleButtons.bind(this);
    this.renderCarouselItems = this.renderCarouselItems.bind(this);
    this.renderCarouselItem = this.renderCarouselItem.bind(this);
  }

  getCenterCoordinate() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect().left + 
            ReactDOM.findDOMNode(this).getBoundingClientRect().width / 2;
  }

  translateCarousel(childCenterCoordinate) {
    const transformXVal = childCenterCoordinate - this.state.centerVal ?
                            this.state.centerVal - childCenterCoordinate :
                            -1 * (childCenterCoordinate - this.state.centerVal);

    this.setState({
      transformX: transformXVal,
    });
  }

  componentDidMount() {
    this.state.centerVal = this.getCenterCoordinate();

    let selectedButtons = [true];

    if (this.props.numCards !== undefined) {
      for (let i = 0; i < this.props.numCards - 1; i += 1) {
        selectedButtons.push(false);
      }

      this.setState({
        selectedButtons: selectedButtons,
      });
    }
  }

  toggleButtons(clickedIdx) {
    let selectedButtons = [];

    // only the clicked button and the true button should toggle its state
    for (let i = 0; i < this.state.selectedButtons.length; i += 1) {
      let isSelected = i === clickedIdx;
      selectedButtons.push(isSelected);
    }

    this.setState({
      selectedButtons: selectedButtons,
    })
  }

  renderCarouselItem(isSelected, idx) {
    return (
      <CarouselItem key={idx} idx={idx} selected={isSelected} translateCarousel={this.translateCarousel} toggleButtons={this.toggleButtons}/>
    )
  }

  renderCarouselItems() {
    return this.state.selectedButtons.map((selected, idx) => this.renderCarouselItem(selected, idx));
  }

  render() {
    let carouselTranslateStyle = {
      transform: `translate(${this.state.transformX}px, 0px)`
    };

    return (
      <div className='carousel' style={carouselTranslateStyle}>
        {this.renderCarouselItems()}
      </div>
    )
  }
}

class ReflexNewCarousel extends React.Component {

  // expose value that determines number of carousel items
  render() {
    return (
      <div className='carousel__container'>
        <Carousel/>
      </div>  
    );
  }
}
export default ReflexNewCarousel;