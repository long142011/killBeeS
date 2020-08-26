// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";
import { NodeHelper } from "./Helper";
import EnemyBullet from "./EnemyBullet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property
    speed: number = 0;
    @property
    margin: number = 0;
    @property(cc.Node)
    gunPoint: cc.Node = null;
    direction: boolean = false;
    startX: number = 0;

    
    start() {
        this.startX = this.node.getPosition().x;

    }

    update(dt) {
        if (!this.direction) {
            this.node.position = cc.v3(this.node.position.x + this.speed * dt, this.node.position.y, 0);
            if (this.node.getPosition().x > this.startX + this.margin) {
                this.direction = true;
            }
        } else {
            this.node.position = cc.v3(this.node.position.x - this.speed * dt, this.node.position.y, 0);
            if (this.node.position.x < this.startX - this.margin) {
                this.direction = false;
            }
        }       
    }
    fire() {
        var scene = cc.director.getScene();
        let enemyBullet = GameManager.Instance.getEnemyBullet(scene);
        enemyBullet.getComponent(EnemyBullet).speed = GameManager.Instance.enemyBulletSpeed;
        enemyBullet.setPosition(NodeHelper.GetConvertedNodePosition(this.gunPoint, enemyBullet));
    }
    explode() {
        this.getComponent(cc.Animation).play("Explode");
        GameManager.Instance.scoreValue += 10;
    }
    return() {
        this.node.active = false;
        if(GameManager.Instance.countDestroy < 40){
            GameManager.Instance.countDestroy += 1;
        } 
        if(GameManager.Instance.countDestroy == 40) {
            GameManager.Instance.win();
        }
        
        
    }
    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {
        if (otherCollider.tag === 1) {
            selfCollider.enabled = false;
            this.explode();
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
    }

    onPreSolve(contact, selfCollider, otherCollider) {
    }

    onPostSolve(contact, selfCollider, otherCollider) {
    }
}
