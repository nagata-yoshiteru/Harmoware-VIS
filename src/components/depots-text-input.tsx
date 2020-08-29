import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

export default class DepotsTextInput extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'データ形式不正'
    }
  }

  onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const { i18n, actions } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    actions.setLoading(true);
    actions.setDepotsTextBase([]);
    reader.readAsText(file);
    const file_name: string = file.name;
    reader.onload = () => {
      let readdata = [];
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { longitude, latitude, position } = readdata[0];
        if ((longitude && latitude) || position) {
          actions.setInputFilename({ depotsTextFileName: file_name });
          actions.setLoading(false);
          actions.setDepotsTextBase(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setInputFilename({ depotsTextFileName: null });
      actions.setDepotsTextBase([]);
      actions.setLoading(false);
    };
  }

  onClick(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions } = this.props;
    actions.setInputFilename({ depotsTextFileName: null });
    actions.setDepotsTextBase([]);
    e.target.value = '';
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <input type="file" accept=".json" 
      id={id} className={className} style={style}
      onClick={this.onClick.bind(this)}
      onChange={this.onSelect.bind(this)}
      />
    );
  }
}
