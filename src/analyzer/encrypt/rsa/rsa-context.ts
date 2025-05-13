/**
 * RSA上下文
 */
class RsaContext {

    modulus: string | null;
    modulusJsonPath: string | null;
    exponent: string | null;
    exponentJsonPath: string | null;

    constructor() {
        this.modulus = null;
        this.modulusJsonPath = null;
        this.exponent = null;
        this.exponentJsonPath = null;
    }

}

export {
    RsaContext
}; 