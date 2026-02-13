import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import log from './log';
import { getIsShowingProject } from '../reducers/project-state';

const PACKAGER_ORIGIN =
    process.env.NODE_ENV === "production"
        ? "http://tauri.localhost"
        : "http://127.0.0.1:1430";

const PackagerIntegrationHOC = function (WrappedComponent) {
    class PackagerIntegrationComponent extends React.Component {
        constructor(props) {
            super(props);
            this.handleClickPackager = this.handleClickPackager.bind(this);
            this.handleMessage = this.handleMessage.bind(this);
        }
        componentDidMount() {
            window.addEventListener('message', this.handleMessage);
        }
        componentWillUnmount() {
            window.removeEventListener('message', this.handleMessage);
        }
        handleClickPackager() {
            if (this.props.canOpenPackager) {
                // Setup events

                const current = window.__TAURI__.webviewWindow.getCurrentWebviewWindow();
                const label = "packager"
                const postMessage = (name, data) => current.emitTo(label, 'import', {
                    type: name,
                    ...data
                });

                current.once('ready-for-import', () => {
                    postMessage('start-import', {});

                    this.props.vm.saveProjectSb3('arraybuffer')
                        .then(buffer => {
                            const name = `${this.props.reduxProjectTitle}.pmp`;
                            postMessage('finish-import', {
                                data: buffer,
                                name
                            });
                        })
                        .catch(err => {
                            log.error(err);
                            postMessage('cancel-import', {});
                        });
                });

                // Open packager window
                const path = `${process.env.ROUTING_STYLE === "wildcard" ? "packager" : "packager.html"}?import_from_tauri`;
                new window.__TAURI__.webviewWindow.WebviewWindow(label, {
                    url: path,
                    title: "Packager",
                    width: 800,
                    height: 600
                });
            }
        }
        handleMessage(e) {
            if (e.origin !== PACKAGER_ORIGIN) {
                return;
            }

            if (!this.props.canOpenPackager) {
                return;
            }

            if (!e.data.p4) {
                return;
            }

            const packagerData = e.data.p4;
            if (packagerData.type !== 'ready-for-import') {
                return;
            }

            // The packager needs to know that we will be importing something so it can display a loading screen
            e.source.postMessage({
                p4: {
                    type: 'start-import'
                }
            }, e.origin);

            this.props.vm.saveProjectSb3('arraybuffer')
                .then(buffer => {
                    const name = `${this.props.reduxProjectTitle}.pmp`;
                    e.source.postMessage({
                        p4: {
                            type: 'finish-import',
                            data: buffer,
                            name
                        }
                    }, e.origin, [buffer]);
                })
                .catch(err => {
                    log.error(err);
                    e.source.postMessage({
                        p4: {
                            type: 'cancel-import'
                        }
                    }, e.origin);
                });
        }
        render() {
            const {
                /* eslint-disable no-unused-vars */
                canOpenPackager,
                /* eslint-enable no-unused-vars */
                ...props
            } = this.props;
            return (
                <WrappedComponent
                    onClickPackager={this.handleClickPackager}
                    {...props}
                />
            );
        }
    }
    PackagerIntegrationComponent.propTypes = {
        canOpenPackager: PropTypes.bool,
        reduxProjectTitle: PropTypes.string,
        vm: PropTypes.shape({
            saveProjectSb3: PropTypes.func
        })
    };
    const mapStateToProps = state => ({
        canOpenPackager: getIsShowingProject(state.scratchGui.projectState.loadingState),
        reduxProjectTitle: state.scratchGui.projectTitle,
        vm: state.scratchGui.vm
    });
    const mapDispatchToProps = () => ({});
    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(PackagerIntegrationComponent);
};

export {
    PackagerIntegrationHOC as default
};
