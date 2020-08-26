// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Background extends cc.Component {
    @property
    speed: number = 0;
    @property
    background_count: number = 0;
    @property
    background_height: number = 0;

    

    // onLoad () {}

    start () {

    }

    update (dt) {
        //Move down
	this.node.position = cc.v3(this.node.position.x,this.node.position.y - this.speed * dt, 0);
		
	let pos = this.node.position;
	if (pos.y < -this.background_height) {
		pos.y += this.background_height * this.background_count;
		this.node.position = pos;
	}
    }
}
