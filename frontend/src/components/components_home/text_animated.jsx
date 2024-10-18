import React from 'react';

class SequentialText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedText: '',
      currentIndex: 0,
    };
    this.timeoutId = null; // Asegúrate de inicializar el timeoutId
  }

  componentDidMount() {
    this.animateText();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId); // Limpia el timeout cuando el componente se desmonte
  }

  animateText = () => {
    const { text, speed } = this.props;
    const { currentIndex } = this.state;

    if (currentIndex < text.length) {
      this.setState(
        (prevState) => ({
          displayedText: prevState.displayedText + text[prevState.currentIndex], // Añade letra
          currentIndex: prevState.currentIndex + 1, // Incrementa el índice
        }),
        () => {
          this.timeoutId = setTimeout(this.animateText, speed); // Programa el siguiente paso
        }
      );
    } else {
      this.timeoutId = setTimeout(this.resetAnimation, 5000); // Reinicia la animación tras 5 segundos
    }
  };

  resetAnimation = () => {
    this.setState({ displayedText: '', currentIndex: 0 }, this.animateText);
  };

  render() {
    return (
      <div
        style={{
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <p
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          {this.state.displayedText}
        </p>
      </div>
    );
  }
}

SequentialText.defaultProps = {
  text: 'Hola, mundo!',
  speed: 100,
};

export default function Component(props = { text: 'Hola, mundo!', speed: 100 }) {
  return <SequentialText {...props} />;
}
