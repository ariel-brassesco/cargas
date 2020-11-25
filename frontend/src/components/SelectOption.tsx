import { ChangeEvent, Component } from "react";

type Props = {
  dataKey?: any;
  title?: string;
  value: string | number;
  options: (string | number)[][];
  stylesClass?: Record<string, string>;
  onChange: (option: any) => boolean | Promise<boolean>;
};

export class SelectOption extends Component<Props> {
  public state: Record<string, any> = {
    loading: false,
    value: this.props.value,
  };

  private handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ loading: true, value: e.target.value });
    const { dataKey } = this.props;
    const data = dataKey ? { [dataKey]: e.target.value } : e.target.value;
    await this.props.onChange(data);
    this.setState({ loading: false });
  };

  public render() {
    const { title, options, stylesClass } = this.props;
    const { loading, value } = this.state;

    return (
      <div className={`select ${loading ? "is-loading" : ""}`}>
        {title ? <label className="label is-medium">{title}</label> : null}
        <select
          onChange={this.handleChange}
          defaultValue={value}
          className={stylesClass && stylesClass[value]}
        >
          {options.map((o, idx) => (
            <option key={idx} value={o[0]} label={String(o[1])} />
          ))}
        </select>
      </div>
    );
  }
}
