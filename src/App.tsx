import { Button, Col, Input, Layout, Row, Spin, Table } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import React from 'react';
import './App.css';

const { Header, Content } = Layout;
const { TextArea } = Input;
const columns = [
  {
    title: 'Char',
    dataIndex: 'letter'
  },
  {
    title: 'Count',
    dataIndex: 'count'
  },
];

interface AppProps {

}

interface AppState {
  text: string;
  lang: string;
  translatedText: string | undefined;
  loading: boolean;
  counts: Array<any> | undefined;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);

    this.state = {
      text: "Hello World",
      lang: "en",
      translatedText: undefined,
      loading: false,
      counts: undefined
    }
  }

  matters = () => {
    let countsObj: any = {};

    const { translatedText } = this.state;
    if (translatedText) {
      for (let i = 0; i < translatedText.length; i++) {
        let character = translatedText.charAt(i);
        let count = countsObj[character];
        countsObj[character] = count ? count + 1 : 1;
      }
      console.log(countsObj);

      let countsArray: any = [];
      Object.keys(countsObj).map((l) => {
        return countsArray.push({
          letter: l,
          count: countsObj[l]
        })
      })
      
      this.setState({
        counts: countsArray
      })

    }
  }

  translateDataFromUserInput = () => {
    this.setState({
      loading: true
    }, () => {
      axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate`, {
        params: {
          key: "trnsl.1.1.20200102T172534Z.e697270fd73ff22c.2eb8beaf026edfad75cc15ad3790a093a3d43fa7",
          lang: "en-tr",
          format: "plain",
          text: this.state.text
        }
      })
        .then(res => {
          this.setState({ translatedText: res.data.text[0], loading: false });
        })
    })
  }

  render() {
    const { text, translatedText, loading, counts } = this.state;
    return (
      <>
        <div>
          <Spin spinning={loading}>
            <Layout>
              <Header style={{ color: "white" }}>Translate App</Header>
              <Content>
                <Row>
                  <Col span={12} style={{ padding: "24px" }}>
                    <p>Enter the text below</p>
                    <TextArea rows={20} defaultValue={text} onChange={(e) => {
                      this.setState({ text: e.target.value })
                    }} />
                    <div style={{ float: "right", marginTop: "12px" }}>
                      <Button onClick={this.translateDataFromUserInput}>Translate to TR</Button>
                    </div>
                  </Col>
                  <Col span={12} style={{ padding: "24px" }}>
                    <p>Result</p>
                    <TextArea value={translatedText ? translatedText : ""} rows={20} />
                    <Button style={{ marginTop: "12px" }} onClick={this.matters}>Scan Text</Button>
                    {counts && (<Table columns={columns} dataSource={counts} />)}

                  </Col>
                </Row>
              </Content>
            </Layout>
          </Spin>
        </div>
      </>
    )
  }
}


export default App;