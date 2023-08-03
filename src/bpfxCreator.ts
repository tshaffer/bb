import { PlayerModel, VideoMode } from '@brightsign/bscore';
import { dmNewSign } from "@brightsign/bsdatamodel";
import { Bpf } from './baInterfaces';

export const generateBpfx = (bpf: Bpf): any => {
};

export function newSign(): any {
  return (dispatch: Function, getState: any): any => {
    const name = 'testBpf';
    const signAction: any = dmNewSign(name, VideoMode.v1920x1080x60p, PlayerModel.XT1144);
    dispatch(signAction);
    // return signAction;

    const newState = getState();
    console.log(newState);
  };
}

