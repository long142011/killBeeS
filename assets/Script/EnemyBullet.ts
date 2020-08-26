// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyBullet extends cc.Component {

    @property
    speed: number = 0;

    returnPool(){
        this.getComponent(cc.Animation).play("EnemyBuletDefault");
        this.getComponent(cc.Collider).enabled = true;
        GameManager.Instance.enemyBulletPool.put(this.node);
    }

    update (dt) {
        this.node.position = cc.v3(this.node.position.x, this.node.position.y - this.speed * dt, 0);
        if(this.node.position.y < 0){
            this.returnPool();
        }
    }

    onBeginContact(contact, selfCollider:cc.Collider, otherCollider:cc.Collider){
        if(otherCollider.tag === 0){
            selfCollider.enabled = false;
            this.getComponent(cc.Animation).play("EnemyBullet");
        }
    }

    onEndContact(contact, selfCollider, otherCollider){
    }

    onPreSolve(contact, selfCollider, otherCollider) {
    }

    onPostSolve(contact, selfCollider, otherCollider) {
    }
}
