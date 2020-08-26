// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import { NodeHelper } from "./Helper";

const { ccclass, property } = cc._decorator;

enum PlayerDirection {
    None, Left, Right
}

@ccclass
export default class Player extends cc.Component {


    @property
    speed: number = 0;
    @property(cc.Node)
    gunPoint: cc.Node = null;

    allowfire: boolean = true;
    direction: PlayerDirection = PlayerDirection.None;
    firerate: number = 0;
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.direction = PlayerDirection.Left;
                break;
            case cc.macro.KEY.right:
                this.direction = PlayerDirection.Right;
                break;
            case cc.macro.KEY.space:
                if(this.firerate <= 0){
                    this.fire();
                }
                break;
        }
    }
    
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.direction = PlayerDirection.None;
                break;
            case cc.macro.KEY.right:
                this.direction = PlayerDirection.None;
                break;
        }
    }

    fire() {
        var scene = cc.director.getScene();
        let playerBullet = GameManager.Instance.getPlayerBullet(scene);
        playerBullet.setPosition(NodeHelper.GetConvertedNodePosition(this.gunPoint, playerBullet));
        this.firerate = 0.2;       
    }

    start() {

    }

    update(dt) {
        switch (this.direction) {
            case PlayerDirection.Left:
                this.node.position = cc.v3(this.node.position.x - this.speed * dt, this.node.position.y, 0);
                break;
            case PlayerDirection.Right:
                this.node.position = cc.v3(this.node.position.x + this.speed * dt, this.node.position.y, 0);
                break;
        }
        if(this.firerate > 0){
            this.firerate -= dt;
        } else {
            this.firerate = 0;
        }

    }
    hide() {
        this.node.active = false;
        GameManager.Instance.lose();
    }
    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {
        if (otherCollider.tag === 3) {          
            GameManager.Instance.liveRemain -= 1;
            if(GameManager.Instance.liveRemain <= 0){
                selfCollider.enabled = false;
                selfCollider.getComponent(cc.Animation).play("Explode");
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
    }

    onPreSolve(contact, selfCollider, otherCollider) {
    }

    onPostSolve(contact, selfCollider, otherCollider) {
    }
}
