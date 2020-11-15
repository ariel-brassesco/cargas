import React, { Component } from "react";

type Props = {
    file?: any;
}

type State = {
    loading: boolean;
    error: string;
    thumb?: any;
}

export class Thumb extends Component<Props, State> {
    public state = {
      loading: false,
      thumb: undefined,
      error: "",
    };

    private readFile = () => {
      const reader = new FileReader();
      reader.onload = () => (
        this.setState({ 
          loading: false,
          thumb: reader.result,
          error: "",
        })
      );

      reader.onerror = () => (
        this.setState({
          loading: false,
          thumb: undefined,
          error: String(reader.error),
        })
      );

      reader.readAsDataURL(this.props.file);
    }
  
    public componentDidUpdate(prevProps: Props) {

      if (!this.props.file) return;
      if (prevProps.file && prevProps.file.name === this.props.file.name) return;
      
      if (!this.state.loading){
        this.setState({ loading: true })
        this.readFile();
      }
    }

    public componentDidMount() {
      
      if (!this.state.loading && this.props.file){
        this.setState({ loading: true })
        this.readFile();
      }
    }

  
    render() {
      const { file } = this.props;
      const { loading, thumb, error } = this.state;
      
      if (!file) return null;
      if (loading) return <p>loading...</p>;
      if (error) return <p>{error}</p>;
  
      return (<img src={thumb}
        alt={file.name}
        className="image mt-2"
        height={200}
        width={200} />);
    }
  }