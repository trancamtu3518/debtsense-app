import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Shadow } from '../constants/theme';

function formatVND(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

export default function ReframeScreen({ navigation }) {
    const [debt, setDebt] = useState(0);
    const [monthly, setMonthly] = useState(0);

    useEffect(() => {
        loadDebt();
    }, []);

    const loadDebt = async () => {
        const raw = await AsyncStorage.getItem('debtData');

        if (!raw) return;

        const data = JSON.parse(raw);

        const totalDebt = data.debts.reduce(
            (sum, d) => sum + (d.total || 0),
            0
        );

        const totalMonthly = data.debts.reduce(
            (sum, d) => sum + (d.monthly || 0),
            0
        );

        setDebt(totalDebt);
        setMonthly(totalMonthly);
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    Debt Reframe
                </Text>

                <View style={{ width: 24 }} />
            </View>

            <View style={styles.card}>

                <Text style={styles.icon}>
                    💡
                </Text>

                <Text style={styles.label}>
                    Góc nhìn mới
                </Text>

                <Text style={styles.bigDebt}>
                    {formatVND(debt)}
                </Text>

                <Text style={styles.arrow}>
                    ↓
                </Text>

                <Text style={styles.monthly}>
                    {formatVND(monthly)}
                    / tháng
                </Text>

                <View style={styles.divider} />

                <Text style={styles.message}>
                    🌱 Bạn không cần giải quyết toàn bộ khoản nợ hôm nay.
                </Text>

                <Text style={styles.message}>
                    Chỉ cần hoàn thành kỳ thanh toán tiếp theo.
                </Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        padding: Spacing.lg,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        marginBottom: Spacing.xl,
    },

    back: {
        fontSize: 24,
        color: Colors.ink,
    },

    title: {
        fontFamily: 'BeVietnamPro-Bold',
        fontSize: 18,
        color: Colors.ink,
    },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        padding: Spacing.xl,
        alignItems: 'center',
        ...Shadow.card,
    },

    icon: {
        fontSize: 48,
        marginBottom: 10,
    },

    label: {
        fontSize: 14,
        color: Colors.inkLight,
        marginBottom: 20,
    },

    bigDebt: {
        fontSize: 34,
        fontFamily: 'BeVietnamPro-Bold',
        color: Colors.ink,
    },

    arrow: {
        fontSize: 28,
        marginVertical: 16,
    },

    monthly: {
        fontSize: 28,
        color: Colors.teal700,
        fontFamily: 'BeVietnamPro-Bold',
    },

    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 24,
    },

    message: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.inkMid,
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'BeVietnamPro-Regular',
    },
});